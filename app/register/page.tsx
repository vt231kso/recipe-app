"use client";

import { useActionState } from "react";
import { register } from "@/actions/auth";
import Link from "next/link";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, null);
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCF9] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-serif text-center mb-2">Створити акаунт</h1>
        {state?.error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center mb-4 border border-red-100">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ім&#39;я
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#86E377] outline-none transition-all disabled:opacity-50"
              placeholder="Ваше ім'я"
            />
          </div>

          <div>
            <label  htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#86E377] outline-none transition-all disabled:opacity-50"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label htmlFor="password"  className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#86E377] outline-none transition-all disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#86E377] text-black font-bold py-3 rounded-xl hover:bg-[#75d266] transition-all mt-4 shadow-sm disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            {isPending ? "Обробка..." : "Зареєструватися"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Вже маєте акаунт?{" "}
          <Link href="/login" className="text-black font-bold hover:underline">
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
}
