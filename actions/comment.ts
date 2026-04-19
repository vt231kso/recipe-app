"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createComment(recipeId: number, formData: FormData,parentId?:number) {
  const session = await auth();
  const text = formData.get("text") as string;

  if (!session?.user?.id) return { error: "Ви повинні увійти, щоб коментувати" };
  if (!text || text.trim().length < 2) return { error: "Коментар занадто короткий" };

  try {
    await prisma.comment.create({
      data: {
        text: text,
        recipeId: recipeId,
        userId: Number(session.user.id),
        parentId: parentId ?? null
      },
    });

    revalidatePath(`/recipes/${recipeId}`);
    return { success: true };
  } catch (error) {
    return { error: "Не вдалося додати коментар" };
  }
}
export async function deleteComment(commentId: number, recipeId: number) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Неавторизовано" };

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) return { error: "Коментар не знайдено" };

    // Перевірка: чи це автор коментаря, чи адмін
    const isOwner = comment.userId === Number(session.user.id);
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return { error: "У вас немає прав для видалення цього коментаря" };
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    revalidatePath(`/recipes/${recipeId}`);
    return { success: true };
  } catch (error) {
    return { error: "Помилка при видаленні" };
  }
}
