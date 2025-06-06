import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getFeaturedProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .take(8);
  },
});

export const getOfferProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .withIndex("by_offer", (q) => q.eq("isOffer", true))
      .collect();
  },
});

export const getProductsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .take(6);
  },
});

export const getAllProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const getProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.productId);
  },
});

export const addProduct = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    discount: v.optional(v.number()),
    weight: v.string(),
    image: v.string(),
    imageUrl: v.optional(v.string()),
    badge: v.optional(v.string()),
    rating: v.number(),
    reviews: v.number(),
    description: v.string(),
    detailedDescription: v.optional(v.string()),
    ingredients: v.optional(v.string()),
    usage: v.optional(v.string()),
    featured: v.boolean(),
    isOffer: v.boolean(),
    stock: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", args);
  },
});

export const updateProduct = mutation({
  args: {
    productId: v.id("products"),
    name: v.optional(v.string()),
    category: v.optional(v.string()),
    price: v.optional(v.number()),
    originalPrice: v.optional(v.number()),
    discount: v.optional(v.number()),
    weight: v.optional(v.string()),
    image: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    badge: v.optional(v.string()),
    rating: v.optional(v.number()),
    reviews: v.optional(v.number()),
    description: v.optional(v.string()),
    detailedDescription: v.optional(v.string()),
    ingredients: v.optional(v.string()),
    usage: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    isOffer: v.optional(v.boolean()),
    stock: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { productId, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    return await ctx.db.patch(productId, filteredUpdates);
  },
});

export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const products = [
      {
        name: "Whey Protein Isolado",
        category: "whey",
        price: 89.90,
        originalPrice: 149.90,
        discount: 40,
        weight: "900g",
        image: "🥛",
        imageUrl: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop",
        badge: "+ Vendido",
        rating: 4.8,
        reviews: 2847,
        description: "Whey protein isolado de alta qualidade para ganho de massa muscular",
        detailedDescription: "O Whey Protein Isolado é a forma mais pura de proteína do soro do leite, com mais de 90% de proteína por porção. Ideal para quem busca ganho de massa muscular magra e recuperação pós-treino.",
        ingredients: "Proteína isolada do soro do leite, lecitina de soja, aromas naturais, sucralose.",
        usage: "Misture 1 scoop (30g) com 200ml de água ou leite. Consuma após o treino ou entre as refeições.",
        featured: true,
        isOffer: true,
        stock: 50,
      },
      {
        name: "Creatina Monohidratada",
        category: "creatina",
        price: 38.90,
        originalPrice: 69.90,
        discount: 44,
        weight: "300g",
        image: "💊",
        imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
        badge: "Recomendado",
        rating: 4.9,
        reviews: 1923,
        description: "Creatina pura para força e explosão muscular",
        detailedDescription: "Creatina monohidratada pura, clinicamente testada para aumentar força, potência e massa muscular. Produto livre de aditivos desnecessários.",
        ingredients: "100% Creatina Monohidratada.",
        usage: "Tome 3-5g diariamente, preferencialmente após o treino com carboidratos.",
        featured: true,
        isOffer: true,
        stock: 75,
      },
      {
        name: "Pré-Treino Hardcore",
        category: "pre-treino",
        price: 79.90,
        originalPrice: 119.90,
        discount: 33,
        weight: "300g",
        image: "⚡",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        badge: "Desconto Relâmpago",
        rating: 4.7,
        reviews: 1456,
        description: "Energia explosiva para treinos intensos",
        detailedDescription: "Fórmula avançada com cafeína, beta-alanina, citrulina e outros ingredientes para máxima performance nos treinos. Energia duradoura sem crash.",
        ingredients: "Cafeína anidra, Beta-alanina, L-Citrulina, Taurina, vitaminas do complexo B.",
        usage: "Misture 1 scoop com 200ml de água 30 minutos antes do treino.",
        featured: true,
        isOffer: false,
        stock: 30,
      },
      {
        name: "Hipercalórico Mass Gainer",
        category: "hipercalorico",
        price: 129.90,
        originalPrice: 199.90,
        discount: 35,
        weight: "3kg",
        image: "🏋️",
        imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
        badge: "Ganho de Massa",
        rating: 4.6,
        reviews: 987,
        description: "Ganho de peso e massa muscular rápido",
        detailedDescription: "Hipercalórico com proteínas de alta qualidade, carboidratos complexos e vitaminas. Ideal para quem tem dificuldade em ganhar peso.",
        ingredients: "Proteína concentrada do soro, maltodextrina, aveia, vitaminas e minerais.",
        usage: "Misture 2 scoops com 400ml de leite entre as refeições.",
        featured: true,
        isOffer: true,
        stock: 25,
      },
      {
        name: "Termogênico Extreme",
        category: "termogenico",
        price: 69.90,
        originalPrice: 99.90,
        discount: 30,
        weight: "60 caps",
        image: "🔥",
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
        badge: "Queima Gordura",
        rating: 4.5,
        reviews: 756,
        description: "Acelera o metabolismo e queima gordura",
        detailedDescription: "Termogênico potente com ingredientes naturais para acelerar o metabolismo e auxiliar na queima de gordura corporal.",
        ingredients: "Cafeína, Chá verde, Guaraná, Pimenta vermelha, Cromo.",
        usage: "Tome 2 cápsulas pela manhã em jejum.",
        featured: true,
        isOffer: false,
        stock: 40,
      },
      {
        name: "BCAA 2:1:1",
        category: "bcaa",
        price: 49.90,
        originalPrice: 79.90,
        discount: 38,
        weight: "120 caps",
        image: "💪",
        imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop",
        badge: "Recuperação",
        rating: 4.7,
        reviews: 1234,
        description: "Aminoácidos essenciais para recuperação muscular",
        detailedDescription: "BCAA na proporção ideal 2:1:1 para máxima recuperação muscular e redução do catabolismo durante os treinos.",
        ingredients: "L-Leucina, L-Isoleucina, L-Valina na proporção 2:1:1.",
        usage: "Tome 3 cápsulas antes e 3 após o treino.",
        featured: true,
        isOffer: true,
        stock: 60,
      },
      {
        name: "Glutamina Pura",
        category: "glutamina",
        price: 59.90,
        originalPrice: 89.90,
        discount: 33,
        weight: "300g",
        image: "🧬",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        badge: "Recuperação",
        rating: 4.6,
        reviews: 892,
        description: "Aminoácido para recuperação e sistema imunológico",
        detailedDescription: "L-Glutamina pura para acelerar a recuperação muscular e fortalecer o sistema imunológico após treinos intensos.",
        ingredients: "100% L-Glutamina.",
        usage: "Misture 5g com água ou suco, 2 vezes ao dia.",
        featured: false,
        isOffer: true,
        stock: 35,
      },
      {
        name: "Multivitamínico Completo",
        category: "vitaminas",
        price: 39.90,
        originalPrice: 59.90,
        discount: 33,
        weight: "60 caps",
        image: "🌟",
        imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
        badge: "Saúde",
        rating: 4.8,
        reviews: 1567,
        description: "Vitaminas e minerais essenciais para atletas",
        detailedDescription: "Complexo vitamínico completo desenvolvido especialmente para atletas e praticantes de atividade física intensa.",
        ingredients: "Vitaminas A, C, D, E, complexo B, zinco, magnésio, ferro.",
        usage: "Tome 1 cápsula pela manhã com o café da manhã.",
        featured: false,
        isOffer: false,
        stock: 80,
      },
    ];

    for (const product of products) {
      await ctx.db.insert("products", product);
    }
  },
});
