"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { handleRecipeImage, prepareRecipeData, formatPrismaRecipeData } from "@/lib/recipe-utils";

export async function updateRecipe(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Необхідна авторизація" };

  try {
    const id = Number(formData.get("id"));
    const rawData = prepareRecipeData(formData);
    const currentImageUrl = formData.get("currentImageUrl") as string;
    const imageUrl = await handleRecipeImage(formData.get("image") as File, currentImageUrl);

    const existing = await prisma.recipe.findUnique({ where: { id }, select: { authorId: true } });
    if (existing?.authorId !== Number(session.user.id) && session.user.role !== "ADMIN") {
      return { error: "Немає прав" };
    }

    const updated = await prisma.$transaction(async (tx) => {
      await tx.recipeIngredient.deleteMany({ where: { recipeId: id } });
      await tx.step.deleteMany({ where: { recipeId: id } });

      return await tx.recipe.update({
        where: { id },
        data: formatPrismaRecipeData(rawData, imageUrl, true)
      });
    });

    revalidatePath(`/recipes/${id}`);
    revalidatePath("/admin/recipes");
    return { success: true, recipeId: updated.id };
  } catch (error) {
    return { error: "Помилка при оновленні" };
  }
}
