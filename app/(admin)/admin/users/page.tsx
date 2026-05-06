import { auth } from "@/auth";
import Link from "next/link";
import {Edit, Plus} from "lucide-react";
import { adminService } from "@/lib/services/admin.service";
import {DeleteUserButton} from "@/components/admin/DeleteUserButton";


export default async function UsersAdminPage() {
  const users = await adminService.getAllUsers();
  const session = await auth();

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-gray-900">Користувачі</h1>
          <p className="text-gray-500 text-sm mt-1">Керування обліковими записами та ролями вашої системи</p>
        </div>

        <Link
          href="/admin/users/create"
          className="flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          <Plus size={20} />
          <span>Додати користувача</span>
        </Link>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="p-5 font-bold text-xs uppercase tracking-wider text-gray-400">Ім&#39;я / Email</th>
              <th className="p-5 font-bold text-xs uppercase tracking-wider text-gray-400">Роль</th>
              <th className="p-5 text-right font-bold text-xs uppercase tracking-wider text-gray-400">Дії</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/30 transition-colors group">
                <td className="p-5">
                  <div className="font-bold text-gray-800 group-hover:text-black">{user.name || "Без імені"}</div>
                  <div className="text-sm text-gray-400">{user.email}</div>
                </td>
                <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-50 text-purple-600 border border-purple-100'
                        : 'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                      {user.role}
                    </span>
                </td>
                <td className="p-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/users/edit/${user.id}`}
                      className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      title="Редагувати"
                    >
                      <Edit size={18} />
                    </Link>

                    {session?.user?.email !== user.email ? (
                      <DeleteUserButton userId={user.id} userName={user.name || user.email} />
                    ) : (
                      <span className="text-[10px] text-gray-300 font-bold uppercase px-3 py-2 border border-dashed border-gray-200 rounded-xl">
                          Це ви
                        </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
