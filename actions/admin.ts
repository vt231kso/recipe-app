"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
type DirectoryType = "category" | "cuisine" | "dietaryNeed"| "ingredient";


async function checkAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Доступ заборонено: ви не адміністратор");
  }
}

export async function deleteRecipeAction(id: number) {
  await checkAdmin();

  try {

    const recipe = await prisma.recipe.findUnique({
      where: { id },
      select: { imageUrl: true }
    });

    if (recipe?.imageUrl && recipe.imageUrl.includes("vercel-storage.com")) {
      try {
        await del(recipe.imageUrl);
      } catch (e) {
        console.error("Не вдалося видалити фото з Blob:", e);
      }
    }

    await prisma.recipe.delete({
      where: { id },
    });

    revalidatePath("/admin/recipes");
    revalidatePath("/recipes");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Помилка при видаленні рецепта" };
  }
}

export async function deleteUserAction(id: number) {
  await checkAdmin();
  try {
    await prisma.user.delete({
      where: { id },
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Не вдалося видалити користувача. Можливо, у нього є зв'язані дані." }; // Повертаємо помилку
  }
}


const capitalize = (str: string) => {
  if (!str) return str;
  const trimmed = str.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};
export async function saveDirectoryItem(
  type: DirectoryType,
  data: { id?: number; name: string }
) {
  await checkAdmin();
  const formattedName = capitalize(data.name);
  try {
    if (data.id) {
      switch (type) {
        case "category":
          const categorySlug = data.name.toLowerCase().trim().replace(/\s+/g, "-");
          await prisma.category.update({
            where: { id: data.id },
            data: { name: formattedName, slug: categorySlug },
          });
          break;
        case "cuisine":
          await prisma.cuisine.update({
            where: { id: data.id },
            data: { name: formattedName },
          });
          break;
        case "dietaryNeed":
          await prisma.dietaryNeed.update({
            where: { id: data.id },
            data: { name: formattedName },
          });
          break;
        case "ingredient":
          await prisma.ingredient.update({ where: { id: data.id }, data: { name: formattedName } });
          break;

      }
    } else {
      switch (type) {
        case "category":
          const newCategorySlug = data.name.toLowerCase().trim().replace(/\s+/g, "-");
          await prisma.category.create({
            data: { name: formattedName, slug: newCategorySlug },
          });
          break;
        case "cuisine":
          await prisma.cuisine.create({
            data: { name: formattedName },
          });
          break;
        case "dietaryNeed":
          await prisma.dietaryNeed.create({
            data: { name: formattedName },
          });
          break;
        case "ingredient":
          await prisma.ingredient.create({ data: { name: formattedName } });
          break;
      }
    }

    revalidatePath("/admin/categories");
    revalidatePath("/admin/cuisines");
    revalidatePath("/admin/dietary-needs");
    revalidatePath("/admin/ingredients");
    return { success: true };
  } catch (error) {
    console.error("Помилка Prisma:", error);

    return { error: "Не вдалося зберегти запис. Перевірте консоль сервера." };
  }
}

export async function deleteDirectoryItem(type: DirectoryType, id: number) {
  await checkAdmin();
  try {
    switch (type) {
      case "category":
        await prisma.category.delete({where: {id}});
        break;
      case "cuisine":
        await prisma.cuisine.delete({where: {id}});
        break;
      case "dietaryNeed":
        await prisma.dietaryNeed.delete({where: {id}});
        break;
      case "ingredient":
        await prisma.ingredient.delete({ where: { id } });
        break;
    }


    revalidatePath("/admin/categories");
    revalidatePath("/admin/cuisines");
    revalidatePath("/admin/dietary-needs");

    return {success: true};
  } catch (error) {
    return {error: "Неможливо видалити: цей елемент використовується в рецептах."};
  }
}


import bcrypt from "bcryptjs";

export async function createUserByAdmin(data: { name: string, email: string, password: string, role: string }) {
  await checkAdmin();

  const hashedPassword = await bcrypt.hash(data.password, 10);

  try {
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      }
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { error: "Користувач з таким email вже існує" };
  }
}
import { Prisma } from "@prisma/client";
import {redirect} from "next/navigation";

export async function updateUserByAdmin(
  id: number,
  data: { name: string; email: string; password?: string; role: string }
) {
  await checkAdmin();

  try {
    const updateData: Prisma.UserUpdateInput = {
      name: data.name,
      email: data.email,
      role: data.role,
    };

    if (data.password && data.password.trim() !== "") {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Update user error:", error);

    return { error: "Не вдалося оновити дані користувача." };
  }
}


export async function deleteComment(id: number) {
  await checkAdmin();
  try {
    await prisma.comment.delete({
      where: { id },
    });
    revalidatePath("/admin/comments");
    return { success: true };
  } catch (error) {
    return { error: "Не вдалося видалити коментар." };
  }
}
