"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { handleRecipeImage, prepareRecipeData, formatPrismaRecipeData } from "@/lib/recipe-utils";

export async function createRecipe(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Необхідна авторизація" };

  try {
    const rawData = prepareRecipeData(formData);
    const imageUrl = await handleRecipeImage(formData.get("image") as File);

    const newRecipe = await prisma.recipe.create({
      data: {
        ...formatPrismaRecipeData(rawData, imageUrl, false),
        authorId: Number(session.user.id),
      }
    });

    revalidatePath("/recipes");
    return { success: true, recipeId: newRecipe.id };
  } catch (error) {
    return { error: "Помилка при створенні" };
  }
}
