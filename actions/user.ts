"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Неавторизовано" };

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!name) {
    return { error: "Ім'я не може бути порожнім" };
  }

  if (!email) {
    return { error: "Email не може бути порожнім" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { error: "Некоректний email" };
  }
  try {
    await prisma.user.update({
      where: { id: Number(session.user.id) },
      data: { name, email },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch  (error){
    console.log("Debug info:", error);
    return { error: "Помилка при оновленні" };
  }
}
import bcrypt from "bcryptjs";

export async function updatePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Неавторизовано" };

  const oldPassword = formData.get("oldPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // 1. Базова валідація
  if (newPassword !== confirmPassword) {
    return { error: "Нові паролі не збігаються" };
  }
  if (newPassword.length < 6) {
    return { error: "Новий пароль має бути не менше 6 символів" };
  }

  try {
    // 2. Отримуємо поточного користувача з бази (щоб взяти хеш пароля)
    const user = await prisma.user.findUnique({
      where: { id: Number(session.user.id) },
    });

    if (!user || !user.password) return { error: "Користувача не знайдено" };

    // 3. Перевіряємо, чи старий пароль правильний
    const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordCorrect) {
      return { error: "Старий пароль введено неправильно" };
    }

    // 4. Хешуємо новий пароль та оновлюємо
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.log("Debug info:", error);
    return { error: "Не вдалося оновити пароль" };
  }
}

export async function getUser(id: number) {
  try {
    const dbUser = await prisma.user.findUnique({
      where: {id: id},
      select: {
        id: true,
        name: true,
        email: true
      }
    });
    return dbUser;
  } catch (error) {
    console.error("Помилка при отриманні користувача:", error);
    return null;
  }
}
