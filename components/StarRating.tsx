"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { rateRecipe } from "@/actions/rate";

export default function StarRating({ recipeId, initialRating }: { recipeId: number, initialRating: number }) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [isPending, startTransition] = useTransition();

  const handleRate = (value: number) => {
    setRating(value);
    startTransition(async () => {
      const result = await rateRecipe(recipeId, value);
      if (result.error) {
        alert(result.message);
        setRating(initialRating);
      }
    });
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          disabled={isPending}
          onClick={() => handleRate(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform active:scale-90 disabled:opacity-50"
        >
          <Star
            size={24}
            className={`${
              star <= (hover || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}
