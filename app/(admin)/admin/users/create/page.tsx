"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserByAdmin } from "@/actions/admin";

export default function CreateUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "USER" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createUserByAdmin(formData);
    if (res.success) {
      router.push("/admin/users");
      router.refresh();
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold font-serif">Додати користувача</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] border shadow-sm space-y-4 max-w-xl">
        <input
          placeholder="Ім'я"
          onChange={e => setFormData({...formData, name: e.target.value})}
          className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50"
          required
        />
        <input
          type="email"
          placeholder="Email"
          onChange={e => setFormData({...formData, email: e.target.value})}
          className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50"
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          onChange={e => setFormData({...formData, password: e.target.value})}
          className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50"
          required
        />
        <select
          className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50"
          onChange={e => setFormData({...formData, role: e.target.value})}
        >
          <option value="USER">Користувач (USER)</option>
          <option value="ADMIN">Адміністратор (ADMIN)</option>
        </select>
        <button className="w-full bg-black text-white py-4 rounded-2xl font-bold">
          Створити користувача
        </button>
      </form>
    </div>
  );
}
