"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";

interface IngredientInput {
  name: string;
  amount: string;
  unit: string;
}

interface StepInput {
  content: string;
}

export async function createRecipe(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Необхідна авторизація" };

  const userId = Number(session.user.id);

  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const cookingTime = Number(formData.get("cookingTime"));
    const difficulty = formData.get("difficulty") as string;
    const categoryId = Number(formData.get("categoryId"));
    const cuisineId = Number(formData.get("cuisineId"));
    const dietaryIds: number[] = JSON.parse(formData.get("dietaryIds") as string || "[]");
    const imageFile = formData.get("image") as File | null;
    let imageUrl = "";

    if (imageFile && imageFile.size > 0) {
      const blob = await put(imageFile.name, imageFile, {
        access: 'public',
      });
      imageUrl = blob.url;
    }

    const ingredientsData: IngredientInput[] = JSON.parse(formData.get("ingredients") as string);
    const stepsData: StepInput[] = JSON.parse(formData.get("steps") as string);

    const newRecipe = await prisma.recipe.create({
      data: {
        title,
        description,
        cookingTime,
        difficulty,
        imageUrl,
        categoryId,
        cuisineId,
        authorId: userId,
        dietaryNeeds: {
          connect: dietaryIds.map(id => ({ id }))
        },
        steps: {
          create: stepsData.map((step: StepInput, index: number) => ({
            content: step.content,
            order: index + 1,
            stepImageUrl: ""
          }))
        },
        ingredients: {
          create: ingredientsData.map((ing: IngredientInput) => ({
            amount: ing.amount,
            unit: ing.unit,
            ingredient: {
              connectOrCreate: {
                where: { name: ing.name.toLowerCase().trim() },
                create: { name: ing.name.toLowerCase().trim() }
              }
            }
          }))
        }
      }
    });

    revalidatePath("/");
    revalidatePath("/recipes");

    return { success: true, recipeId: newRecipe.id };

  } catch (error) {
    console.error("CREATE_RECIPE_ERROR:", error);
    return { error: "Помилка при завантаженні фото або збереженні в БД" };
  }
}
