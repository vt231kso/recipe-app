"use client";

import { Bookmark } from "lucide-react";
import { toggleSave } from "@/actions/save";
import { useTransition, useState } from "react"; // Додали useState
import { clsx } from "clsx";

interface SaveButtonProps {
  recipeId: number;
  initialIsSaved: boolean;
}

export default function SaveButton({
                                     recipeId,
                                     initialIsSaved,
                                   }: SaveButtonProps) {
  const [isPending, startTransition] = useTransition();

  // Локальний стан для миттєвого відгуку інтерфейсу
  const [isSaved, setIsSaved] = useState(initialIsSaved);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Зупиняємо перехід по Link у RecipeCard

    // Оптимістично змінюємо стан
    setIsSaved(!isSaved);

    startTransition(async () => {
      const result = await toggleSave(recipeId);

      if (result?.error) {
        // Якщо на сервері помилка — повертаємо колір назад
        setIsSaved(initialIsSaved);
        alert(result.message);
      }
    });
  };

  return (
    <button
      onClick={handleSaveClick}
      disabled={isPending}
      className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors group disabled:cursor-not-allowed"
      aria-label={isSaved ? "Видалити зі збереженого" : "Зберегти рецепт"}
    >
      <Bookmark
        className={clsx(
          "w-6 h-6 transition-all duration-300",
          isSaved // Тепер використовуємо локальний isSaved
            ? "fill-[#86E377] text-[#86E377] scale-110"
            : "text-gray-400 group-hover:text-[#86E377]",
          isPending && "animate-pulse scale-90"
        )}
      />
    </button>
  );
}
