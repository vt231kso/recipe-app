"use client";

import { useState } from "react";
import { updatePassword } from "@/actions/user";

export default function ChangePasswordForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setMessage(null);
    setIsPending(true);

    const result = await updatePassword(formData);
    setIsPending(false);

    if (result.success) {
      setMessage({ type: 'success', text: "Пароль успішно змінено!" });
      setTimeout(() => {
        setIsOpen(false);
        setMessage(null);
      }, 3000);
    } else {
      setMessage({ type: 'error', text: result.error || "Помилка" });
    }
  }

  if (!isOpen) {
    return (
      <div className="space-y-2">
        {message?.type === 'success' && (
          <p className="text-sm font-bold text-green-600 animate-bounce">
            {message.text}
          </p>
        )}
        <button
          onClick={() => setIsOpen(true)}
          className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
        >
          Змінити пароль безпеки →
        </button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="bg-gray-50 rounded-3xl p-6 border border-gray-100 space-y-4 mt-4">
      <h3 className="font-bold text-gray-900">Зміна пароля</h3>

      <div className="space-y-3">
        <input
          type="password"
          name="oldPassword"
          placeholder="Старий пароль"
          required
          className="w-full p-3 bg-white rounded-xl border focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          type="password"
          name="newPassword"
          placeholder="Новий пароль"
          required
          className="w-full p-3 bg-white rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#86E377]"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Підтвердіть новий пароль"
          required
          className="w-full p-3 bg-white rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#86E377]"
        />
      </div>

      {message && (
        <p className={`text-sm font-bold ${message.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
          {message.text}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 bg-gray-900 text-white rounded-lg font-bold text-xs disabled:opacity-50"
        >
          {isPending ? "Оновлення..." : "Оновити пароль"}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setMessage(null);
          }}
          className="px-5 py-2 text-gray-500 font-bold text-xs"
        >
          Скасувати
        </button>
      </div>
    </form>
  );
}
