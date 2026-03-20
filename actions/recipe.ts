"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"


export async function fetchRecipes() {
  return await prisma.recipe.findMany({
    include: { category: true, author: true },
    orderBy: { createdAt: 'desc' }
  })
}

export async function fetchRecipeById(id: number) {

  if (!id || isNaN(id)) return null;

  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        category: true,
        cuisine: true,
        author: {
          select: {
            name: true,
            role: true,
          },
        },
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

    return recipe;
  } catch (error) {
    console.error("Помилка Prisma:", error);
    return null;
  }
}

export async function fetchRelatedRecipes(categoryId: number, currentRecipeId: number) {
  try {
    return await prisma.recipe.findMany({
      where: {
        categoryId: categoryId,
        NOT: {
          id: currentRecipeId,
        },
      },
      take: 3,
      include: {
        category: true,
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
