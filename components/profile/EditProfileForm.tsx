"use client";

import { useState } from "react";
import { updateProfile } from "@/actions/user";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";

type UserProps = {
  user: {
    id: string | number;
    name?: string | null;
    email?: string | null;
  }
}

export default function EditProfileForm({ user }: UserProps) {
  const [isEditing, setIsEditing] = useState(false);

  async function handleSubmit(formData: FormData) {
    const result = await updateProfile(formData);

    if (result.success) {
      setIsEditing(false);
      alert("Дані оновлено успішно!");
    } else {
      alert(result.error);
    }
  }

  return (
    <div className="space-y-6">
      {!isEditing ? (
        <div className="bg-white shadow-sm rounded-3xl p-8 border border-gray-100 flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{user.name || "Користувач"}</p>
            <p className="text-gray-500">{user.email}</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm text-gray-700"
          >
            Редагувати профіль
          </button>
        </div>
      ) : (
        <form action={handleSubmit} className="bg-white shadow-sm rounded-3xl p-8 border border-gray-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-xs font-bold uppercase text-gray-400 ml-2">Ім&#39;я</label>
              <input
                name="name"
                defaultValue={user.name || ""}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#86E377]"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-bold uppercase text-gray-400 ml-2">Email</label>
              <input
                name="email"
                defaultValue={user.email || ""}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#86E377]"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm">
              Зберегти зміни
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-8 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm"
            >
              Скасувати
            </button>
          </div>
        </form>
      )}

      {!isEditing && (
        <div className="bg-white shadow-sm rounded-3xl p-8 border border-gray-100">
          <ChangePasswordForm />
        </div>
      )}
    </div>
  );
}
