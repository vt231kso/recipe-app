"use client";

import { Trash2, Edit2 } from "lucide-react";
import { deleteDirectoryItem } from "@/actions/admin";
import Link from "next/link";

interface Props {
  items: { id: number; name: string }[];
  type: "category" | "cuisine" | "dietaryNeed"| "ingredient";
  title: string;
}

export function DirectoryTable({ items, type, title }: Props) {
  const handleDelete = async (id: number) => {
    if (!confirm(`Ви впевнені, що хочете видалити цей елемент із списку "${title}"?`)) return;
    const res = await deleteDirectoryItem(type, id);
    if (res?.error) alert(res.error);
  };

  const getPath = (type: string) => {
    switch (type) {
      case "category": return "categories";
      case "cuisine": return "cuisines";
      case "dietaryNeed": return "dietary-needs";
      case "ingredient": return "ingredients";
      default: return type;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b">
        <tr>
          <th className="p-5 font-semibold text-gray-700">Назва {title}</th>
          <th className="p-5 text-right font-semibold text-gray-700">Дії</th>
        </tr>
        </thead>
        <tbody>
        {items.map((item) => (
          <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
            <td className="p-5 font-medium text-gray-800">{item.name}</td>
            <td className="p-5">
              <div className="flex justify-end gap-3">
                <Link
                  href={`/admin/${getPath(type)}/edit/${item.id}`}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <Edit2 size={18} />
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
