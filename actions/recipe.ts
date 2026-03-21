"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import {RecipePreview, RecipeWithDetails} from "@/types/recipe";


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
export async function createRecipe(formData: FormData) {
  // Тут буде логіка збереження
  // revalidatePath('/') -- оновлює головну сторінку після додавання
}
