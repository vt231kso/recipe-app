import Link from 'next/link';

export default function CategoryNotFound() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 bg-[#FDFCF9]">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-black text-gray-200">404</h1>
        <div className="space-y-2">
          <h2 className="text-3xl font-serif text-gray-900">Кухню не знайдено</h2>
          <p className="text-gray-500 max-w-sm mx-auto">
            Схоже, такої кухні не існує.
          </p>
        </div>

        <Link
          href="/admin/cuisines"
          className="inline-block px-8 py-3 bg-[#86E377] text-black font-bold rounded-xl shadow-md hover:bg-[#75d266] transition-all"
        >
          Повернутися до всіх кухонь
        </Link>
      </div>
    </main>
  );
}
