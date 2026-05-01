"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveDirectoryItem } from "@/actions/admin";

interface Props {
  type: "category" | "cuisine" | "dietaryNeed"| "ingredient";
  initialData?: { id: number; name: string };
}

export function DirectoryForm({ type, initialData }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || "");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await saveDirectoryItem(type, { id: initialData?.id, name });

    if (res.success) {
      let returnPath = "/admin/";
      if (type === "category") returnPath += "categories";
      else if (type === "cuisine") returnPath += "cuisines";
      else if (type === "dietaryNeed") returnPath += "dietary-needs";
      else if (type === "ingredient") returnPath += "ingredients";

      router.push(returnPath);
      router.refresh();
    } else {
      alert(res.error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white p-8 rounded-[32px] border shadow-sm space-y-6 max-w-xl">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Назва</label>
        <input
          required
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
          placeholder={type === "cuisine" ? "Наприклад: Італійська" : "Введіть назву..."}
        />
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
        >
          Скасувати
        </button>
        <button
          disabled={loading || !name.trim()}
          type="submit"
          className="flex-[2] bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all disabled:bg-gray-300"
        >
          {loading ? "Збереження..." : initialData?.id ? "Зберегти зміни" : "Створити"}
        </button>
      </div>
    </form>
  );
}
