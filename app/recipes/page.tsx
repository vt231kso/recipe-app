import { fetchFilterOptions } from "@/actions/recipe";
import FilterBar from "@/components/FilterBar";
import { Suspense } from "react";
import { ReactElement } from "react";
import RecipeList from "@/components/RecipeList";
import CardsSkeleton from "@/components/CardsSkeleton";

interface RecipesPageProps {
  searchParams: Promise<{
    query?: string;
    category?: string;
    cuisine?: string;
    dietary?: string;
    time?: string;
    ingredient?: string;
    page?: string;
  }>;
}

export default async function RecipesPage({ searchParams }: RecipesPageProps): Promise<ReactElement> {
  const params = await searchParams;

  const options = await fetchFilterOptions();

  return (
    <main className="bg-[#FDFCF9] min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-6 pt-16">

        <div className="mb-10 text-center md:text-left">
          <h1 className="text-6xl font-serif text-gray-900 leading-tight">
            Рецепти
          </h1>
        </div>


        <FilterBar options={options} />

        <Suspense key={JSON.stringify(params)} fallback={<CardsSkeleton />}>
          <RecipeList params={params} />
        </Suspense>
      </div>
    </main>
  );
}
