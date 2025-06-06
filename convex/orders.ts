import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createOrder = mutation({
  args: {
    customerInfo: v.object({
      name: v.string(),
      cpf: v.string(),
      email: v.string(),
      phone: v.string(),
      address: v.object({
        street: v.string(),
        number: v.string(),
        complement: v.optional(v.string()),
        neighborhood: v.string(),
        city: v.string(),
        state: v.string(),
        zipCode: v.string(),
      }),
    }),
    paymentMethod: v.string(),
    shippingMethod: v.string(),
    items: v.array(v.object({
      productId: v.id("products"),
      quantity: v.number(),
      price: v.number(),
      name: v.string(),
    })),
    total: v.number(),
    shippingCost: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    const orderId = await ctx.db.insert("orders", {
      userId,
      customerInfo: args.customerInfo,
      paymentMethod: args.paymentMethod,
      shippingMethod: args.shippingMethod,
      items: args.items,
      total: args.total,
      shippingCost: args.shippingCost,
      status: "pending",
      pixKey: "pix@beastsupplements.com", // Chave PIX editável
    });

    return orderId;
  },
});

export const getOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getOrder = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    const order = await ctx.db.get(args.orderId);
    if (!order || order.userId !== userId) {
      throw new Error("Order not found");
    }

    return order;
  },
});
