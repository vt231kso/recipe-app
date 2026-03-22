"use client";
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Plus } from 'lucide-react';
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white py-4 md:py-6 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="w-12 md:w-auto flex md:block">
          <button
            className="md:hidden p-2 text-gray-800"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
        <nav className={`
          ${isOpen ? 'flex' : 'hidden'}
          md:flex flex-col md:flex-row absolute md:relative top-full left-0 w-full md:w-auto
          bg-white md:bg-transparent shadow-xl md:shadow-none z-50
          gap-6 md:gap-8 p-8 md:p-0 font-bold text-gray-800 uppercase tracking-wide text-lg
        `}>
          <Link href="/recipes" className="hover:text-gray-500" onClick={() => setIsOpen(false)}>Рецепти</Link>
          <Link href="/health" className="hover:text-gray-500" onClick={() => setIsOpen(false)}>Хелсі</Link>
          <Link href="/tips" className="hover:text-gray-500" onClick={() => setIsOpen(false)}>Лайфхаки</Link>
        </nav>


        <Link href="/" className="text-3xl md:text-5xl font-serif italic font-black lowercase tracking-tighter shrink-0">
          shuba
        </Link>

        <div className="flex items-center">
          <button className="bg-[#F2E880] hover:bg-[#E6DB65] font-bold py-2 px-4 md:py-3 md:px-6 rounded-xl flex items-center gap-2 transition-colors">
            <Plus className="w-6 h-6" />
            <span className="hidden md:inline">Поділись рецептом</span>
          </button>
        </div>
      </div>
    </div>
  );
}
