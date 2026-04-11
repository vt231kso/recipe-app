"use client";

import { useActionState } from "react";
import { login, LoginState } from "@/actions/auth";
import Link from "next/link";



export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<LoginState | null, FormData>(login, null);
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCF9] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-serif text-center mb-8">З поверненням!</h1>

        {state?.error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center mb-4 border border-red-100">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#86E377] outline-none transition-all disabled:opacity-50"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input
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
            className="w-full bg-[#86E377] text-black font-bold py-3 rounded-xl hover:bg-[#75d266] transition-all mt-4 shadow-sm disabled:bg-gray-200"
          >
            {isPending ? "Вхід..." : "Увійти"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Ще не маєте акаунта?{" "}
          <Link href="/register" className="text-black font-bold hover:underline">
            Зареєструватися
          </Link>
        </p>
      </div>
    </div>
  );
}
