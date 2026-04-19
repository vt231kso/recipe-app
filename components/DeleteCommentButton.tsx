"use client";

import { Trash2 } from "lucide-react";
import { deleteComment } from "@/actions/comment";
import { useTransition } from "react";

export default function DeleteCommentButton({ id, recipeId }: { id: number; recipeId: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Видалити цей відгук?")) {
      startTransition(async () => {
        await deleteComment(id, recipeId);
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
