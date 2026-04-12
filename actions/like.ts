"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export type LikeResult = {
  success?: boolean;
  error?: string;
  message?: string;
};

export async function toggleLike(recipeId: number): Promise<LikeResult> {
  const session = await auth();
  
  if (!session?.user?.id) {
    return {
      error: "AUTH_REQUIRED",
      message: "Будь ласка, увійдіть, щоб ставити лайки."
    };
  }

  const userId = Number(session.user.id);

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_recipeId: { userId, recipeId },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { userId_recipeId: { userId, recipeId } },
      });
    } else {
      await prisma.like.create({
        data: { userId, recipeId },
      });
    }
    revalidatePath(`/recipes/${recipeId}`);
    revalidatePath("/");

    return { success: true };

  } catch (error) {
    console.error("LIKE_ACTION_ERROR:", error);
    return {
      error: "SERVER_ERROR",
      message: "Не вдалося оновити лайк. Спробуйте пізніше."
    };
  }
}
