import { fetchFilteredRecipes } from "@/actions/recipe";
import RecipeCard from "@/components/RecipeCard";

interface RecipeListProps {
  params: {
    query?: string;
    category?: string;
    cuisine?: string;
    dietary?: string;
    time?: string;
    ingredient?: string;
  };
}

export default async function RecipeList({ params }: RecipeListProps) {
  const recipes = await fetchFilteredRecipes(params);

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 mt-12">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
