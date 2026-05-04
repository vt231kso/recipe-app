import Image from 'next/image';
import Link from 'next/link';

import { RecipePreview, RecipeWithDetails } from '@/types/recipe';
import LikeButton from '@/components/LikeButton';
import { auth } from "@/auth";
import SaveButton from '@/components/SaveButton';

interface RecipeCardProps {
  recipe: RecipePreview | RecipeWithDetails;
  priority?: boolean;
  currentUserId?: number;
}

export default function RecipeCard({ recipe, priority = false,currentUserId }: RecipeCardProps) {


  const isLiked =
    recipe.likes?.some(like => like.userId === currentUserId) || false;

  const isSaved =
    recipe.savedBy?.some(save => save.userId === currentUserId) || false;
  const likesCount = recipe._count?.likes || 0;


  return (
    <div className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">

      <div className="absolute top-4 right-4 z-20 flex flex-col items-center bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl shadow-sm border border-white/50">
        <LikeButton
          recipeId={recipe.id}
          initialIsLiked={isLiked}
          likesCount={likesCount}
        />
        <div className="h-px w-full bg-gray-200 my-1" aria-hidden="true" />
        <SaveButton
          recipeId={recipe.id}
          initialIsSaved={isSaved}
        />
      </div>

      <Link href={`/recipes/${recipe.id}`} className="block flex-grow" aria-label={`Переглянути рецепт: ${recipe.title}`}>
        <div className="relative">
          <div className="relative h-[280px] w-full rounded-t-3xl overflow-hidden bg-gray-50">
            <Image
              src={recipe.imageUrl || '/placeholder.jpg'}
              alt={recipe.title}
              fill
              quality={75}
              sizes="(max-width: 640px) 100vw,
       (max-width: 768px) 50vw,
       (max-width: 1280px) 33vw,
       320px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority={priority}
            />
          </div>

          <div className="bg-[#86E377] px-4 py-2 flex items-center gap-2 mt-[-20px] relative z-10 w-fit ml-6 shadow-md rounded-md">
            <span className="text-sm font-black uppercase tracking-tighter text-black">
              {recipe.category?.name}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-5 flex-grow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex gap-2">
              <span className="bg-[#D1F1CD] text-[#2D5A27] text-[10px] font-bold px-3 py-1 rounded-md uppercase">
                {recipe.category?.name}-рецепти
              </span>
              <span className="bg-[#F3F1E9] text-gray-800 text-[10px] font-bold px-3 py-1 rounded-md border border-gray-200">
                {recipe.difficulty || 'Середній'}
              </span>
            </div>

            <h3 className="text-2xl font-serif leading-tight text-gray-900 group-hover:text-gray-600 transition-colors">
              {recipe.title}
            </h3>
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="w-fit bg-[#F3F1E9] px-3 py-1.5 rounded-md text-[11px] font-bold text-gray-700 border border-gray-200">
                {recipe.author?.name || "Анонім"}
              </div>
            </div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              ⏱ Час: {recipe.cookingTime} хв
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
