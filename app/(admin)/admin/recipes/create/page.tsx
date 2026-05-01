import { prisma } from "@/lib/prisma";
import RecipeForm from "@/components/RecipeForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {getRecipeMetadata} from "@/actions/recipe";

export default async function CreateRecipePage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const [categories, cuisines, dietaryNeeds] = await getRecipeMetadata();

  return (
    <div className="py-10 bg-[#FDFCF9] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 mb-10">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
          Створення рецепту
        </h1>
        <p className="text-gray-500 text-lg italic">
          Поділіться своїм кулінарним шедевром зі світом
        </p>
      </div>

      <RecipeForm
        categories={categories}
        cuisines={cuisines}
        dietaryNeeds={dietaryNeeds}
      />
    </div>
  );
}
