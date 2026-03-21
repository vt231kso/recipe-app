import { fetchFilterOptions, fetchFilteredRecipes } from "@/actions/recipe";
import RecipeCard from "@/components/RecipeCard";
import FilterBar from "@/components/FilterBar";
import { ReactElement } from "react";

interface RecipesPageProps {
  searchParams: Promise<{
    category?: string;
    cuisine?: string;
    dietary?: string;
    time?: string;
    ingredient?: string;
  }>;
}

export default async function RecipesPage({ searchParams }: RecipesPageProps): Promise<ReactElement> {
  const params = await searchParams;

  const [options, recipes] = await Promise.all([
    fetchFilterOptions(),
    fetchFilteredRecipes(params)
  ]);

  return (
    <main className="bg-[#FDFCF9] min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-6 pt-16">

        <div className="mb-10 text-center md:text-left">
          <h1 className="text-6xl font-serif text-gray-900 leading-tight">
            Рецепти
            <span className="text-2xl text-gray-300 ml-4 align-middle font-sans font-light">
              {recipes.length}
            </span>
          </h1>
        </div>


        <FilterBar options={options} />

        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 mt-12">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center">
            <h3 className="text-2xl font-serif text-gray-400 italic">
              На жаль, за вашим запитом нічого не знайдено...
            </h3>
            <p className="text-sm text-gray-400 mt-2">
              Спробуйте змінити фільтри або обрати інші інгредієнти.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
