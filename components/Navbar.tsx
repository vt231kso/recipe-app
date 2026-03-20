import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="bg-white py-6">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <nav className="flex gap-8 font-bold text-gray-800 uppercase tracking-wide text-lg">
          <Link href="/recipes" className="hover:text-gray-500">Рецепти ⌵</Link>
          <Link href="/health" className="hover:text-gray-500">Хелсі ⌵</Link>
          <Link href="/tips" className="hover:text-gray-500">Лайфхаки</Link>
        </nav>

        {/* Логотип Shuba-style */}
        <Link href="/" className="text-5xl font-serif italic font-black lowercase tracking-tighter">
          shuba
        </Link>

        <div className="flex items-center gap-8">
          <Link href="/more" className="font-bold text-gray-800 uppercase text-lg">Ще ⌵</Link>
          <button className="bg-[#F2E880] hover:bg-[#E6DB65] font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors">
            <span className="text-xl">+</span> Поділись рецептом
          </button>
        </div>
      </div>
    </div>
  );
}
