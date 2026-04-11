"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export interface RegisterState {
  error?: string;
  success?: string;
}

export async function register(
  prevState: RegisterState | null,
  formData: FormData
): Promise<RegisterState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || name.length < 2) return { error: "Ім'я занадто коротке" };
  if (!email || !email.includes("@")) return { error: "Введіть коректний email" };
  if (!password || password.length < 6) return { error: "Пароль має бути не менше 6 символів" };

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: "Цей email вже зареєстрований" };

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { name, email, password: hashedPassword, role: "USER" },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;

    console.error("REGISTRATION_ERROR:", error);
    return { error: "Помилка при створенні акаунта" };
  }

  redirect("/login");
}

export interface LoginState {
  error?: string;
}

export async function login(
  prevState: LoginState | null,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Введіть email та пароль" };

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Неправильний email або пароль" };
        default:
          return { error: "Помилка авторизації" };
      }
    }

    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error(error);
    return { error: "Щось пішло не так" };
  }

  return {};
}
