"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRecipe } from "@/actions/create-recipe";
import { updateRecipe } from "@/actions/update-recipe";
import { RecipeFormValues } from "@/lib/validations/recipe";

export function useRecipeSubmit(recipeId?: number, initialImageUrl?: string | null) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: RecipeFormValues) => {
    console.log(data);
    setIsPending(true);
    setServerError(null);

    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      if (recipeId) {
        formData.append("id", recipeId.toString());
        if (initialImageUrl) {
          formData.append("currentImageUrl", initialImageUrl);
        }
      }
      if (recipeId) {
        formData.append("id", recipeId.toString());
      }
      const result = recipeId
        ? await updateRecipe(formData)
        : await createRecipe(formData);

      if (result?.error) {
        setServerError(result.error);
      } else if (result?.success) {
        router.push(`/recipes/${result.recipeId}`);
        router.refresh();
      }
    } catch (e) {
      setServerError("Щось пішло не так при збереженні");
    } finally {
      setIsPending(false);
    }
  };

  return { onSubmit, isPending, serverError };
}
