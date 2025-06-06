import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  products: defineTable({
    name: v.string(),
    category: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    discount: v.optional(v.number()),
    weight: v.string(),
    image: v.string(), // Emoji or URL
    imageUrl: v.optional(v.string()), // Additional image URL
    badge: v.optional(v.string()),
    rating: v.number(),
    reviews: v.number(),
    description: v.string(),
    detailedDescription: v.optional(v.string()),
    ingredients: v.optional(v.string()),
    usage: v.optional(v.string()),
    featured: v.boolean(),
    isOffer: v.optional(v.boolean()), // New field for offers
    stock: v.optional(v.number()),
  }).index("by_category", ["category"])
    .index("by_featured", ["featured"])
    .index("by_offer", ["isOffer"]),
  
  cart: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    quantity: v.number(),
  }).index("by_user", ["userId"]),
  
  orders: defineTable({
    userId: v.id("users"),
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
    status: v.string(),
    pixKey: v.string(),
  }).index("by_user", ["userId"]),
  
  contacts: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    status: v.string(),
  }),
  
  reviews: defineTable({
    productId: v.id("products"),
    userId: v.id("users"),
    rating: v.number(),
    comment: v.string(),
    userName: v.string(),
  }).index("by_product", ["productId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
