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

export default async function AdminLayout({
                                            children,
                                          }: {
  children: React.ReactNode;
}) {
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
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">

      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white border-b lg:border-r border-gray-200 lg:min-h-screen p-4 lg:p-6 shadow-sm">

        <div className="mb-6 lg:mb-10 px-2">
          <h1 className="text-2xl font-black text-green-600 tracking-tight">
            AdminPanel
          </h1>
        </div>

        {/* Навігація */}
        <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="
                flex items-center gap-3
                p-3
                whitespace-nowrap
                text-gray-600
                hover:bg-green-50
                hover:text-green-600
                rounded-2xl
                transition-all
                font-medium
                group
              "
            >
              <span className="text-gray-400 group-hover:text-green-500">
                {item.icon}
              </span>

              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="mt-6 lg:mt-10 pt-4 border-t border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-3 p-3 text-gray-400 hover:text-red-500 transition-all font-medium"
          >
            <LogOut size={20} />
            На головну
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
