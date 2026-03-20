"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Функція для отримання всіх рецептів
export async function fetchRecipes() {
  return await prisma.recipe.findMany({
    include: { category: true, author: true },
    orderBy: { createdAt: 'desc' }
  })
}

// Функція для створення рецепту (знадобиться потім для форми)
export async function createRecipe(formData: FormData) {
  // Тут буде логіка збереження
  // revalidatePath('/') -- оновлює головну сторінку після додавання
}
