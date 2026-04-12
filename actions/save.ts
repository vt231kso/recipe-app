"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export type SaveResult = {
  success?: boolean;
  error?: string;
  message?: string;
};

export async function toggleSave(recipeId: number): Promise<SaveResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "AUTH_REQUIRED",
      message: "Будь ласка, увійдіть, щоб зберігати рецепти."
    };
  }

  const userId = Number(session.user.id);

  try {
    const existingSave = await prisma.savedRecipe.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });

    if (existingSave) {
      await prisma.savedRecipe.delete({
        where: {
          userId_recipeId: {
            userId,
            recipeId,
          },
        },
      });
    } else {
      await prisma.savedRecipe.create({
        data: {
          userId,
          recipeId,
        },
      });
    }

    revalidatePath(`/recipes/${recipeId}`);
    revalidatePath("/");

    return { success: true };

  } catch (error) {
    console.error("SAVE_ACTION_ERROR:", error);
    return {
      error: "SERVER_ERROR",
      message: "Не вдалося оновити статус збереження. Спробуйте пізніше."
    };
  }
}
