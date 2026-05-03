import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RecipeForm from "@/components/RecipeForm";
import { getRecipeMetadata } from "@/actions/recipe";

export default async function CreateRecipePage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const [categories, cuisines, dietaryNeeds] =
    await getRecipeMetadata();

  return (
    <div className="py-6 sm:py-10 bg-[#FDFCF9] min-h-screen">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-8 sm:mb-10">

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
          Створення рецепту
        </h1>

        <p className="text-gray-500 text-base sm:text-lg italic">
          Поділіться своїм кулінарним шедевром зі світом
        </p>
      </div>

      <div className="px-4 sm:px-6">
        <RecipeForm
          categories={categories}
          cuisines={cuisines}
          dietaryNeeds={dietaryNeeds}
        />
      </div>
    </div>
  );
}
