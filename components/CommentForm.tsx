"use client";

import { createComment } from "@/actions/comment";
import { useRef } from "react";

interface CommentFormProps {
  recipeId: number;
  parentId?: number;
  onSuccess?: () => void; // Додаємо цей пропс
}

export default function CommentForm({ recipeId, parentId, onSuccess }: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  async function action(formData: FormData) {
    const result = await createComment(recipeId, formData, parentId);

    if (result?.success) {
      formRef.current?.reset();
      // Якщо це відповідь (є parentId), викликаємо закриття форми
      if (onSuccess) {
        onSuccess();
      }
    } else if (result?.error) {
      alert(result.error);
    }
  }

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <textarea
        name="text"
        placeholder={
          parentId
            ? "Напишіть відповідь..."
            : "Поділіться вашими враженнями від рецепту..."
        }
        className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#86E377] focus:border-transparent outline-none transition-all resize-none h-32 text-gray-700"
        required
      />
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-[#86E377] text-black font-bold py-3 px-8 rounded-xl hover:shadow-lg transition-all active:scale-95"
        >
          {parentId ? "Відповісти" : "Надіслати коментар"}
        </button>
      </div>
    </form>
  );
}
