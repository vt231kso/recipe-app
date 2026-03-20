import Image from 'next/image';
import Link from 'next/link';

import { RecipeWithDetails } from '@/types/recipe';

interface RecipeCardProps {
  recipe: RecipeWithDetails;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
      <Link href={`/recipe/${recipe.id}`} className="block">

        <div className="relative">
          <div className="relative h-[280px] w-full rounded-t-3xl overflow-hidden">
            <Image
              src={recipe.imageUrl || '/placeholder.jpg'}
              alt={recipe.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority={recipe.id === 1} // Додаємо пріоритет для першої картинки (опціонально)
            />
          </div>
          <div className="bg-[#86E377] px-4 py-2 flex items-center gap-2 mt-[-20px] relative z-10 w-fit ml-6 shadow-md rounded-md">
            <span className="text-sm font-black uppercase tracking-tighter text-black">
              {recipe.category.name}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-5 flex-grow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex gap-2">
              <span className="bg-[#D1F1CD] text-[#2D5A27] text-[10px] font-bold px-3 py-1 rounded-md uppercase">
                {recipe.category.name}-рецепти
              </span>
              <span className="bg-[#F3F1E9] text-gray-700 text-[10px] font-bold px-3 py-1 rounded-md border border-gray-200">
                {recipe.difficulty || 'Середній!'}
              </span>
            </div>

            <h3 className="text-2xl font-serif leading-tight text-gray-900 group-hover:text-gray-600 transition-colors">
              {recipe.title}
            </h3>
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="w-fit bg-[#F3F1E9] px-3 py-1.5 rounded-md text-[11px] font-bold text-gray-700 border border-gray-200">
                {recipe.author.name}
              </div>
            </div>

            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              ⏱ Час приготування: {recipe.cookingTime} хв
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
