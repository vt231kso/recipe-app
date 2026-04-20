"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export type RatingResult = {
  success?: boolean;
  error?: string;
  message?: string;
};

export async function rateRecipe(recipeId: number, value: number): Promise<RatingResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "AUTH_REQUIRED",
      message: "Будь ласка, увійдіть, щоб поставити оцінку."
    };
  }

  if (value < 1 || value > 5) {
    return {
      error: "INVALID_VALUE",
      message: "Оцінка має бути від 1 до 5 зірок."
    };
  }

  const userId = Number(session.user.id);

  try {
    await prisma.rating.upsert({
      where: {
        userId_recipeId: { userId, recipeId },
      },
      update: {
        value,
      },
      create: {
        userId,
        recipeId,
        value,
      },
    });

    revalidatePath(`/recipes/${recipeId}`);
    revalidatePath("/");

    return { success: true };

  } catch (error) {
    console.error("RATING_ACTION_ERROR:", error);
    return {
      error: "SERVER_ERROR",
      message: "Не вдалося зберегти оцінку. Спробуйте пізніше."
    };
  }
}
