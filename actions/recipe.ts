"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import {RecipePreview, RecipeWithDetails,FilterOptions} from "@/types/recipe";

export interface FilterParams {
  query?: string;
  category?: string;
  cuisine?: string;
  dietary?: string;
  time?: string;
  ingredient?: string;
}
export async function fetchRecipes(): Promise<RecipePreview[]> {
  return await prisma.recipe.findMany({
    select: {
      id: true,
      title: true,
      imageUrl: true,
      difficulty: true,
      cookingTime: true,
      category: { select: { name: true } },
      author: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function fetchRecipeById(id: number):Promise<RecipeWithDetails | null> {

  if (!id || isNaN(id)) return null;

  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        category: true,
        cuisine: true,
        author: true,
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
        dietaryNeeds: true,
      },
    });

    return recipe as RecipeWithDetails | null;
  } catch (error) {
    console.error("Помилка Prisma:", error);
    return null;
  }
}

export async function fetchRelatedRecipes(categoryId: number, currentRecipeId: number):Promise<RecipePreview[]> {
  try {
    return await prisma.recipe.findMany({
      where: {
        categoryId: categoryId,
        NOT: {
          id: currentRecipeId,
        },
      },
      take: 3,
      select: {
        id: true,
        title: true,
        imageUrl: true,
        difficulty: true,
        cookingTime: true,
        category: { select: { name: true } },
        author: { select: { name: true } },
      },
    });
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
    select: {
      id: true,
      title: true,
      imageUrl: true,
      difficulty: true,
      cookingTime: true,
      category: { select: { name: true } },
      author: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' }
  });

  return recipes as RecipePreview[];
}
export async function createRecipe(formData: FormData) {
  // Тут буде логіка збереження
  // revalidatePath('/') -- оновлює головну сторінку після додавання
}
