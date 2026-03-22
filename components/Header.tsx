"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Facebook, Send, Instagram, Bell, User } from 'lucide-react'; // Встанови: npm install lucide-react

export default function HeaderTop() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("query") || "");
  useEffect(() => {
    const urlQuery = searchParams.get("query") || "";
    if (urlQuery !== query) {
      const handler = setTimeout(() => setQuery(urlQuery), 0);
      return () => clearTimeout(handler);
    }
  }, [searchParams]);
  useEffect(() => {
    const urlQuery = searchParams.get("query") || "";
    if (query === urlQuery) return;

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("query", query);
      } else {
        params.delete("query");
      }
      router.push(`/recipes?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, router, searchParams]);


  return (
    <div className="border-b bg-white py-2 md:py-3">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-4">

        <div className="relative  flex-1 md:w-1/3">
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
          <div className="hidden md:flex flex gap-3 text-gray-600 border-r pr-6">
            <Facebook className="w-5 h-5 cursor-pointer hover:text-blue-600" />
            <Send className="w-5 h-5 cursor-pointer hover:text-blue-400" />
            <Instagram className="w-5 h-5 cursor-pointer hover:text-pink-600" />
          </div>
          <div className="flex items-center  gap-3 md:gap-4  text-gray-700 font-medium">
            <div className="relative">
              <Bell className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-[#F2E880] text-[10px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">1</span>
            </div>
            <button className="flex items-center gap-2 border rounded-xl p-2 md:px-4 md:py-2 hover:bg-gray-50 transition-colors">
              <User className="w-5 h-5" />
              <span className="hidden md:inline text-sm">Кабінет</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
