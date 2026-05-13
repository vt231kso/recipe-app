import RecipeCard from "@/components/RecipeCard";
import { auth } from "@/auth";
import { fetchFilteredRecipes, FilterParams } from "@/actions/recipe";
interface RecipeListProps {
  params: FilterParams;
}
import Pagination from "@/components/Pagination";

export default async function RecipeList({ params }: RecipeListProps) {
  const session = await auth(); // Отримуємо сесію
  const userId = Number(session?.user?.id); // Дістаємо ID користувача
  const { recipes, totalPages } = await fetchFilteredRecipes(params);
  if (recipes.length === 0) {
    return (
      <div className="py-32 text-center">
        <h3 className="text-2xl font-serif text-gray-400 italic">
          На жаль, за вашим запитом нічого не знайдено...
        </h3>
        <p className="text-sm text-gray-400 mt-2">
          Спробуйте змінити фільтри або обрати інші інгредієнти.
        </p>
      </div>
    );
  }

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 mt-12">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} currentUserId={userId} />
      ))}
    </div>
  <Pagination
    currentPage={Number(params.page) || 1}
    totalPages={totalPages}
    params={params}
  />
      </>
  );
}
