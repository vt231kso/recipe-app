import { fetchRecipeById } from '@/actions/recipe';
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import RecipeForm from "@/components/RecipeForm";
// Тобі також треба буде дістати категорії, кухні та дієти для форми
import { adminService } from "@/lib/services/admin.service";

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const recipeId = parseInt(resolvedParams.id);

  const session = await auth();
  const userId = Number(session?.user?.id);

  // 1. Використовуємо твою готову функцію
  const recipe = await fetchRecipeById(recipeId, userId);

  if (!recipe) notFound();

  // 2. Перевірка безпеки
  const isAuthor = userId === recipe.authorId;
  const isAdmin = session?.user?.role === "ADMIN";

  if (!isAuthor && !isAdmin) {
    redirect("/");
  }

  const { categories, cuisines, dietaryNeeds } = await adminService.getAllTableData();

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold font-serif mb-8">Редагування: {recipe.title}</h1>
      <RecipeForm
        categories={categories}
        cuisines={cuisines}
        dietaryNeeds={dietaryNeeds}
        initialData={recipe}
        isEdit={true}
      />
    </div>
  );
}
