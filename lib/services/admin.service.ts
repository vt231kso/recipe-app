import { prisma } from "@/lib/prisma";

export const adminService = {
  async getStats() {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      users,
      recipes,
      comments,
      newRecipesWeek,
      mostPopularCategory,
      avgCookingTime
    ] = await Promise.all([
      prisma.user.count(),
      prisma.recipe.count(),
      prisma.comment.count(),
      prisma.recipe.count({
        where: { createdAt: { gte: lastWeek } }
      }),

      prisma.category.findFirst({
        orderBy: { recipes: { _count: 'desc' } },
        select: { name: true, _count: { select: { recipes: true } } }
      }),
      prisma.recipe.aggregate({
        _avg: { cookingTime: true }
      })
    ]);

    return {
      users,
      recipes,
      comments,
      newRecipesWeek,
      popularCategory: mostPopularCategory?.name || "—",
      avgTime: Math.round(avgCookingTime._avg.cookingTime || 0)
    };
  },

  async getAllRecipes() {
    return await prisma.recipe.findMany({
      include: { author: true, category: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async getAllUsers() {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  },
  async getAllCuisines() {
    return await prisma.cuisine.findMany({
      orderBy:{name:"asc"},
    });
  },
  async getAllDietaryNeeds() {
    return await prisma.dietaryNeed.findMany({
      orderBy:{name:"asc"},
    });
  },

  async getAllCategories() {
    return await prisma.category.findMany({
      include: { _count: { select: { recipes: true } } },
      orderBy: { name: "asc" },
    });
  },

  async getAllIngredients() {
    return await prisma.ingredient.findMany({
      orderBy: { name: "asc" },
    });
  },

  async getAllTableData() {
    const [categories, cuisines, dietaryNeeds, ingredients] = await Promise.all([
      prisma.category.findMany({ include: { _count: { select: { recipes: true } } } }),
      prisma.cuisine.findMany({ include: { _count: { select: { recipes: true } } } }),
      prisma.dietaryNeed.findMany({ include: { _count: { select: { recipes: true } } } }),
      prisma.ingredient.findMany({ include: { _count: { select: { recipes: true } } } }),
    ]);
    return { categories, cuisines, dietaryNeeds, ingredients };
  },

  async getAllComments() {
    return await prisma.comment.findMany({
      include: {
        user: { select: { name: true, email: true } },
        recipe: { select: { id:true, title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  },
  async getDirectoryItemById(type: "category" | "cuisine" | "dietaryNeed" | "ingredient", id: number) {
    const model = prisma[type] as any;
    return await model.findUnique({
      where: { id },
    });
  },
};

