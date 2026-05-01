import { del, put } from "@vercel/blob";
import { IngredientInput, StepInput } from "@/types/recipe";

export async function handleRecipeImage(imageFile: File | null, currentUrl?: string | null) {
  if (imageFile && imageFile.size > 0) {
    if (currentUrl?.includes("vercel-storage.com")) {
      await del(currentUrl);
    }
    const blob = await put(imageFile.name, imageFile, { access: 'public' });
    return blob.url;
  }
  return currentUrl || "";
}

export function prepareRecipeData(formData: FormData) {
  const ingredientsData: IngredientInput[] = JSON.parse(formData.get("ingredients") as string || "[]");
  const stepsData: StepInput[] = JSON.parse(formData.get("steps") as string || "[]");
  const dietaryIds: number[] = JSON.parse(formData.get("dietaryIds") as string || "[]");

  return {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    cookingTime: Number(formData.get("cookingTime")),
    difficulty: formData.get("difficulty") as string,
    categoryId: Number(formData.get("categoryId")),
    cuisineId: Number(formData.get("cuisineId")),
    dietaryIds,
    ingredientsData,
    stepsData
  };
}

export function formatPrismaRecipeData(data: ReturnType<typeof prepareRecipeData>, imageUrl: string, isUpdate = false) {
  return {
    title: data.title,
    description: data.description,
    cookingTime: data.cookingTime,
    difficulty: data.difficulty,
    imageUrl,
    categoryId: data.categoryId,
    cuisineId: data.cuisineId,
    dietaryNeeds: {
      [isUpdate ? 'set' : 'connect']: data.dietaryIds.map(id => ({ id }))
    },
    steps: {
      create: data.stepsData.map((s, i) => ({ content: s.content, order: i + 1, stepImageUrl: "" }))
    },
    ingredients: {
      create: data.ingredientsData.map((ing) => ({
        amount: ing.amount,
        unit: ing.unit,
        ingredient: {
          connectOrCreate: {
            where: { name: ing.name.toLowerCase().trim() },
            create: { name: ing.name.toLowerCase().trim() }
          }
        }
      }))
    }
  };
}
