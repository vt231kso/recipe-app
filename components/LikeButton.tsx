"use client";

import { Heart } from "lucide-react";
import { toggleLike } from "@/actions/like";
import { useTransition } from "react";
import { clsx } from "clsx";

interface LikeButtonProps {
  recipeId: number;
  initialIsLiked: boolean;
  likesCount: number;
}

export default function LikeButton({
                                     recipeId,
                                     initialIsLiked,
                                     likesCount
                                   }: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleLikeClick = () => {
    startTransition(async () => {
      const result = await toggleLike(recipeId);

      if (result?.error) {
        alert(result.message);
      }
    });
  };

  return (
    <button
      onClick={handleLikeClick}
      disabled={isPending}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors group disabled:cursor-not-allowed"
      title={initialIsLiked ? "Прибрати лайк" : "Поставити лайк"}
    >
      <Heart
        className={clsx(
          "w-6 h-6 transition-all duration-300",
          initialIsLiked
            ? "fill-red-500 text-red-500 scale-110"
            : "text-gray-400 group-hover:text-red-400",
          isPending && "animate-pulse scale-90"
        )}
      />

      <span className={clsx(
        "text-sm font-semibold transition-colors",
        initialIsLiked ? "text-red-600" : "text-gray-600"
      )}>
        {likesCount}
      </span>
    </button>
  );
}
