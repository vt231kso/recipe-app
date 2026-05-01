import { fetchRecipeById, getRecipeMetadata } from "@/actions/recipe";
import RecipeForm from "@/components/RecipeForm";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";

// 1. Описуємо params як Promise
interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: Props) {
  const session = await auth();

  // 2. Обов'язково чекаємо на розв'язання промісу params
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (!session) redirect("/api/auth/signin");

  const recipe = await fetchRecipeById(id, Number(session.user.id));

  if (!recipe) notFound();

  const isAuthor = String(recipe.authorId) === String(session.user.id);
  const isAdmin = session.user.role === "ADMIN";

  if (!isAuthor && !isAdmin) {
    console.log("ACCESS DENIED: Redirecting to home...");
    redirect("/");
  }

  const [categories, cuisines, dietaryNeeds] = await getRecipeMetadata();

  return (
    <div className="py-10 bg-[#FDFCF9] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 mb-10">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
          Редагування рецепту
        </h1>
        <p className="text-gray-500 text-lg italic">
          Оновіть свій кулінарний шедевр: {recipe.title}
        </p>
      </div>

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
