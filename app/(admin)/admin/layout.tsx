import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Utensils,
  Users,
  LogOut,
  Tags,
  Globe,
  Heart,
  Apple,
  MessageSquare
} from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  const navItems = [
    { href: "/admin", label: "Дашборд", icon: <LayoutDashboard size={20} /> },
    { href: "/admin/recipes", label: "Рецепти", icon: <Utensils size={20} /> },
    { href: "/admin/users", label: "Користувачі", icon: <Users size={20} /> },
    { href: "/admin/categories", label: "Категорії", icon: <Tags size={20} /> },
    { href: "/admin/cuisines", label: "Кухня", icon: <Globe size={20} /> },
    { href: "/admin/dietary-needs", label: "Дієти", icon: <Heart size={20} /> },
    { href: "/admin/ingredients", label: "Інгредієнти", icon: <Apple size={20} /> },
    { href: "/admin/comments", label: "Коментарі", icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full p-6 shadow-sm flex flex-col">
        <div className="mb-10 px-2">
          <h1 className="text-2xl font-black text-green-600 tracking-tight">AdminPanel</h1>
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 p-3 text-gray-600 hover:bg-green-50 hover:text-green-600 rounded-2xl transition-all font-medium group"
            >
              <span className="text-gray-400 group-hover:text-green-500 transition-colors">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-100">
          <Link href="/" className="flex items-center gap-3 p-3 text-gray-400 hover:text-red-500 transition-all font-medium">
            <LogOut size={20} /> На головну
          </Link>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-10">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
