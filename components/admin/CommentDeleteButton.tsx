"use client";

import { Trash2 } from "lucide-react";
import { deleteComment } from "@/actions/admin";

interface Props {
  id: number;
}

export function CommentDeleteButton({ id }: Props) {
  const handleDelete = async () => {
    if (confirm("Видалити цей коментар?")) {
      const res = await deleteComment(id);
      if (res?.error) alert(res.error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
      title="Видалити коментар"
    >
      <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
    </button>
  );
}
