"use server"

import { prisma } from "@/lib/prisma"
import {RecipePreview, RecipeWithDetails,FilterOptions} from "@/types/recipe";

export interface FilterParams {
  query?: string;
  category?: string;
  cuisine?: string;
  dietary?: string;
  time?: string;
  ingredient?: string;
}
const recipePreviewInclude = {
  category: { select: { name: true } },
  author: { select: { name: true } },
  likes: true,
  savedBy: true,
  _count: { select: { likes: true,savedBy: true } }
} as const;
const recipePreviewSelect = {
  id: true,
  title: true,
  imageUrl: true,
  difficulty: true,
  cookingTime: true,
  createdAt: true,

  category: {
    select: {
      name: true,
    },
  },

  author: {
    select: {
      name: true,
    },
  },

  likes: {
    select: {
      userId: true,
    },
  },

  savedBy: {
    select: {
      userId: true,
    },
  },

  _count: {
    select: {
      likes: true,
      savedBy: true,
    },
  },
} as const;
export async function fetchRecipes(): Promise<RecipePreview[]> {
  const recipes = await prisma.recipe.findMany({
    // include: recipePreviewInclude,
    take: 6,
    select: recipePreviewSelect,
    orderBy: { createdAt: 'desc' }
  });

  return recipes as RecipePreview[];
}

export async function fetchRecipeById(id: number,userId?:number):Promise<RecipeWithDetails | null> {

  if (!id || isNaN(id)) return null;

  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      category: true,
      author: true,
      steps: {orderBy: {order: 'asc'}},
      ingredients: {include: {ingredient: true}},
      likes: true,
      savedBy: true,
      rating: true,
      dietaryNeeds: true,
      comments: {
        where: {parentId: null},
        include: {
          user: {select: {name: true}},
          replies: {
            include: {
              user: {select: {name: true}}
            },
            orderBy: {createdAt: 'asc'}
          }
        },
        orderBy: {createdAt: 'desc'}
      },
      _count: {select: {likes: true, savedBy: true, comments: true, rating: true}}
    }
  });

  if (!recipe) return null;

  const totalRatings = recipe._count.rating;
  const avgRating = totalRatings > 0
    ? (recipe.rating.reduce((acc, r) => acc + r.value, 0) / totalRatings).toFixed(1)
    : "0.0";

  const userRating = userId
    ? recipe.rating.find(r => r.userId === userId)?.value || 0
    : 0;

  return {
    ...recipe,
    avgRating,
    userRating,
    totalRatings
  } as RecipeWithDetails;
}

export async function fetchRelatedRecipes(categoryId: number, currentRecipeId: number): Promise<RecipePreview[]> {
  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        categoryId: categoryId,
        NOT: {
          id: currentRecipeId,
        },
      },
      take: 3,
      include: recipePreviewInclude,
    });

    return recipes as RecipePreview[];
  } catch (error) {
    console.error("Помилка при отриманні схожих рецептів:", error);
    return [];
  }
}
export async function fetchFilterOptions(): Promise<FilterOptions> {
  const [categories, cuisines, dietaryNeeds, ingredients] = await Promise.all([
    prisma.category.findMany(),
    prisma.cuisine.findMany(),
    prisma.dietaryNeed.findMany(),
    prisma.ingredient.findMany({ take: 10 }),
  ]);

  return { categories, cuisines, dietaryNeeds, ingredients };
}

export async function fetchFilteredRecipes(params: FilterParams): Promise<RecipePreview[]> {
  const parseIds = (idString?: string): number[] | undefined =>
    idString ? idString.split(",").map(id => parseInt(id)).filter(id => !isNaN(id)) : undefined;

  const parseSlugs = (slugString?: string): string[] | undefined =>
    slugString ? slugString.split(",") : undefined;

  const recipes = await prisma.recipe.findMany({
    where: {
      OR: params.query ? [
        { title: { contains: params.query, mode: 'insensitive' } },
        { description: { contains: params.query, mode: 'insensitive' } }
      ] : undefined,
      category: params.category ? {
        slug: { in: parseSlugs(params.category) }
      } : undefined,

      cuisineId: params.cuisine ? {
        in: parseIds(params.cuisine)
      } : undefined,

      dietaryNeeds: params.dietary ? {
        some: { id: { in: parseIds(params.dietary) } }
      } : undefined,

      ingredients: params.ingredient ? {
        some: { ingredientId: { in: parseIds(params.ingredient) } }
      } : undefined,

      cookingTime: params.time ? { lte: parseInt(params.time) } : undefined,
    },
    select: recipePreviewSelect,
    // include: recipePreviewInclude,
    orderBy: { createdAt: 'desc' }
  });

  return recipes as RecipePreview[];
}

export async function fetchSavedRecipes(userId: number): Promise<RecipePreview[]> {
  const recipes = await prisma.recipe.findMany({
    where: {
      savedBy: {
        some: {
          userId: userId
        }
      }
    },
    // include: recipePreviewInclude,
    select: recipePreviewSelect,
    orderBy: { createdAt: 'desc' }
  });

  return recipes as RecipePreview[];
}

export  function getRecipeMetadata() {
  return  Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.cuisine.findMany({ orderBy: { name: 'asc' } }),
    prisma.dietaryNeed.findMany({ orderBy: { name: 'asc' } })
  ]);
}


export async function fetchUserRecipes(userId: number): Promise<RecipePreview[]> {
  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        authorId: userId
      },
      // include: recipePreviewInclude,
      select: recipePreviewSelect,
      orderBy: { createdAt: 'desc' }
    });

    return recipes as RecipePreview[];
  } catch (error) {
    console.error("Помилка при отриманні власних рецептів:", error);
    return [];
  }
}
export async function fetchTopRatedRecipes(): Promise<RecipePreview[]> {
  return (await prisma.recipe.findMany({
    take: 3,
    orderBy: {
      likes: { _count: 'desc' }
    },
    // include: recipePreviewInclude,
    select: recipePreviewSelect,
  })) as RecipePreview[];
}

export async function fetchEasyRecipes(): Promise<RecipePreview[]> {
  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        difficulty: 'Easy',
      },
      take: 3,
      orderBy: {
        createdAt: 'desc',
      },
      // include: recipePreviewInclude,
      select: recipePreviewSelect,
    });

    return recipes as RecipePreview[];
  } catch (error) {
    console.error("Помилка при отриманні легких рецептів:", error);
    return [];
  }
}
