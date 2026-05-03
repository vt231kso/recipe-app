"use client";

import {Search, Facebook, Send, Instagram, User, LogOut, ShieldCheck} from 'lucide-react';
import { useSearch } from "@/hooks/useSearch";
import { signOut } from "next-auth/react";
import Link from "next/link";

import { Session } from "next-auth";

interface Props {
  session: Session | null;
}

export default function HeaderTopClient({ session }: Props) {
  const { query, setQuery } = useSearch();

  return (
    <div className="border-b bg-white py-2 md:py-3">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-4">

        <div className="relative flex-1 md:w-1/3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Пошук рецептів..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-sm outline-none focus:border-[#86E377] transition-all"
          />
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <div className="hidden md:flex gap-3 text-gray-600 border-r pr-6">
            <Facebook className="w-5 h-5 cursor-pointer hover:text-blue-600" />
            <Send className="w-5 h-5 cursor-pointer hover:text-blue-400" />
            <Instagram className="w-5 h-5 cursor-pointer hover:text-pink-600" />
          </div>

          <div className="flex items-center gap-3 md:gap-4 text-gray-700 font-medium">

            {session ? (
              <div className="flex items-center gap-2">
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-100 rounded-xl px-3 py-2 hover:bg-green-100 transition-colors"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span className="hidden lg:inline text-sm font-bold">Адмін</span>
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 border rounded-xl p-2 md:px-4 md:py-2 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline text-sm">Кабінет</span>
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 md:gap-4">
                <Link
                  href="/login"
                  className="text-sm font-semibold hover:text-[#86E377]"
                >
                  Увійти
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:block text-sm bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800"
                >
                  Реєстрація
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
