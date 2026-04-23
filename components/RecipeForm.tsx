"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recipeSchema } from "@/lib/validations/recipe";
import { Loader2, Info } from "lucide-react";

import { useRecipeImage } from "@/hooks/use-recipe-image";
import { useRecipeSubmit } from "@/hooks/use-recipe-submit";

import { ImageUpload } from "@/components/recipe/create/ImageUpload";
import { BasicInfoSection } from "@/components/recipe/create/BasicInfoSection";
import { DietarySelection } from "@/components/recipe/create/DietarySelection";
import { IngredientsSection } from "@/components/recipe/create/IngredientsSection";
import { StepsSection } from "@/components/recipe/create/StepsSection";

interface Props {
  categories: { id: number; name: string }[];
  cuisines: { id: number; name: string }[];
  dietaryNeeds: { id: number; name: string }[];
}

export default function RecipeForm({ categories, cuisines, dietaryNeeds }: Props) {
  const methods = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: "",
      description: "",
      cookingTime: 30,
      difficulty: "Medium",
      categoryId: 0,
      cuisineId: 0,
      dietaryIds: [],
      ingredients: [{ name: "", amount: "", unit: "" }],
      steps: [{ content: "" }],
    },
  });

  const { imagePreview, imageError, handleImageChange, clearImage } = useRecipeImage(methods.setValue);
  const { onSubmit, isPending, serverError } = useRecipeSubmit();

  const displayError = imageError || serverError;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-8 pb-20 px-4">
        <header className="text-center py-10 space-y-2">
          <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">Створити рецепт</h1>
          <p className="text-gray-500 text-lg">Поділіться своїм кулінарним шедевром</p>
        </header>

        {displayError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3">
            <Info size={20} />
            <span className="font-medium">{displayError}</span>
          </div>
        )}

        <ImageUpload
          preview={imagePreview}
          onImageChange={handleImageChange}
          onClear={clearImage}
        />

        <BasicInfoSection categories={categories} cuisines={cuisines} />
        <DietarySelection items={dietaryNeeds} />
        <IngredientsSection />
        <StepsSection />

        <button
          disabled={isPending}
          type="submit"
          className="w-full bg-gray-900 text-white py-6 rounded-[28px] font-bold text-xl shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:bg-gray-400"
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" />
              <span>Збереження...</span>
            </>
          ) : (
            "Опублікувати рецепт"
          )}
        </button>
      </form>
    </FormProvider>
  );
}
