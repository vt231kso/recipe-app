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

export async function fetchRecipes(): Promise<RecipePreview[]> {
  const recipes = await prisma.recipe.findMany({
    include: recipePreviewInclude,
    orderBy: { createdAt: 'desc' }
  });

  return recipes as RecipePreview[];
}

export async function fetchRecipeById(id: number):Promise<RecipeWithDetails | null> {

  if (!id || isNaN(id)) return null;

  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      category: true,
      author: true,
      steps: { orderBy: { order: 'asc' } },
      ingredients: { include: { ingredient: true } },
      likes: true,
      savedBy: true,
      _count: { select: { likes: true,savedBy:true } }
    }
  });

  return recipe as RecipeWithDetails | null;
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
    prisma.ingredient.findMany({ take: 50 }),
  ]);

  return { categories, cuisines, dietaryNeeds, ingredients };
}

export async function fetchFilteredRecipes(params: FilterParams): Promise<RecipePreview[]> {
console.log(params);
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
    include: recipePreviewInclude,
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
    include: recipePreviewInclude,
    orderBy: { createdAt: 'desc' }
  });

  return recipes as RecipePreview[];
}
export async function createRecipe(formData: FormData) {
  // Тут буде логіка збереження
  // revalidatePath('/') -- оновлює головну сторінку після додавання
}
