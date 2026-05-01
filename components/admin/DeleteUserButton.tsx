"use client";

import { deleteUserAction } from "@/actions/admin";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export function DeleteUserButton({ userId, userName }: { userId: number, userName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Ви впевнені, що хочете видалити користувача ${userName}?`)) return;

    setIsDeleting(true);
    try {
      const result = await deleteUserAction(userId);
      if (result?.error) {
        alert(result.error);
      }
    } catch (error) {
      alert("Сталася помилка при видаленні");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
      title="Видалити користувача"
    >
      <Trash2 size={18} />
    </button>
  );
}
