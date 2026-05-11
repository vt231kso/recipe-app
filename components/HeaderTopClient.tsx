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
          <label htmlFor="recipe-search" className="sr-only">
            Пошук рецептів
          </label>
          <input
            id="recipe-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Пошук рецептів..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-sm outline-none focus:border-[#86E377] transition-all"
          />
          <Search aria-hidden="true" className="absolute right-3 top-2.5 w-4 h-4 text-gray-600" />
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <div className="hidden md:flex gap-3 text-gray-600 border-r pr-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:text-blue-600 transition-colors"
            >
              <Facebook aria-hidden="true" className="w-5 h-5" />
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:text-blue-600 transition-colors"
            >
              <Send aria-hidden="true" className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:text-pink-600 transition-colors"
            >
              <Instagram aria-hidden="true" className="w-5 h-5" />
            </a>
          </div>

          <div className="flex items-center gap-3 md:gap-4 text-gray-700 font-medium">

            {session ? (
              <div className="flex items-center gap-2">
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-100 rounded-xl px-3 py-2 hover:bg-green-100 transition-colors"
                  >
                    <ShieldCheck aria-hidden="true" className="w-5 h-5" />
                    <span className="hidden lg:inline text-sm font-bold">Адмін</span>
                  </Link>
                )}
                <Link
                  href="/profile"
                  aria-label="Перейти до профілю"
                  className="flex items-center gap-2 border rounded-xl p-2 md:px-4 md:py-2 hover:bg-gray-50 transition-colors"
                >
                  <User aria-hidden="true" className="w-5 h-5" />
                  <span className="hidden md:inline text-sm">Кабінет</span>
                </Link>

                <button
                  aria-label="Вийти з акаунта"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 min-h-[44px] min-w-[44px] text-gray-500 hover:text-red-500 transition-colors"
                >
                  <LogOut aria-hidden="true" className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 md:gap-4">
                <Link
                  href="/login"
                  className="hidden sm:flex items-center text-sm bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 min-h-[44px]"
                >
                  Увійти
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:flex items-center text-sm bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 min-h-[44px]"
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
