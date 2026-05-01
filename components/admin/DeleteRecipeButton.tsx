"use client";
import { Trash2 } from "lucide-react";
import { deleteRecipeAction } from "@/actions/admin";

export function DeleteRecipeButton({ id }: { id: number }) {
  const handleDelete = async () => {
    if (confirm("Ви впевнені, що хочете видалити цей рецепт? Фото також буде видалено.")) {
      await deleteRecipeAction(id);
    }
  };

  return (
    <button onClick={handleDelete} className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-all">
      <Trash2 size={18} />
    </button>
  );
}
