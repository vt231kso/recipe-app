"use client";

import { useEffect } from "react";

export default function RecipesError({error, reset,}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Recipe Page Error:", error);
  }, [error]);

  return (
    <div className="py-24 px-6 text-center bg-[#FDFCF9] min-h-[60vh] flex flex-col items-center justify-center">
      <div className="max-w-md space-y-6">
        {/* Іконка попередження */}
        <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h2 className="text-3xl font-serif text-gray-900">Ой! Помилка завантаження</h2>

        <p className="text-gray-500 leading-relaxed">
          Не вдалося отримати список рецептів. Це може бути через тимчасові проблеми з сервером або з'єднанням.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button
            onClick={() => reset()}
            className="px-8 py-3 bg-[#86E377] text-black font-bold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            Спробувати знову
          </button>

          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
          >
            Оновити сторінку
          </button>
        </div>
      </div>
    </div>
  );
}
