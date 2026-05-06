"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserByAdmin, createUserByAdmin } from "@/actions/admin";

interface Props {
  initialData?: { id: number; name: string; email: string; role: string };
}
interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: string;
}
export function UserForm({ initialData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    password: "",
    role: initialData?.role || "USER",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = initialData
      ? await updateUserByAdmin(initialData.id, formData)
      : await createUserByAdmin({name: formData.name,
      email: formData.email,
      role: formData.role,
      password: formData.password});

    if (res.success) {
      router.push("/admin/users");
      router.refresh();
    } else {
      alert(res.error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] border shadow-sm space-y-4 max-w-xl">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Ім&#39;я</label>
        <input
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
          className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Пароль {initialData && <span className="text-gray-400 font-normal">(залиште пустим, щоб не змінювати)</span>}
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={e => setFormData({...formData, password: e.target.value})}
          className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none"
          placeholder={initialData ? "••••••••" : "Введіть пароль"}
          required={!initialData}
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Роль</label>
        <select
          value={formData.role}
          onChange={e => setFormData({...formData, role: e.target.value})}
          className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none"
        >
          <option value="USER">Користувач (USER)</option>
          <option value="ADMIN">Адміністратор (ADMIN)</option>
        </select>
      </div>

      <div className="pt-4 flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-4 rounded-2xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          Скасувати
        </button>
        <button
          disabled={loading}
          className="flex-[2] bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 disabled:bg-gray-300"
        >
          {loading ? "Збереження..." : initialData ? "Оновити дані" : "Створити користувача"}
        </button>
      </div>
    </form>
  );
}
