import Image from 'next/image'
import Link from 'next/link'
import { fetchRecipes } from '@/actions/recipe'
import RecipeCard from '@/components/RecipeCard'

export default async function HomePage() {
  const recipes = await fetchRecipes();

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Заголовок */}
      <div className="flex justify-between items-end mb-12 border-b-2 border-gray-100 pb-6">
        <h1 className="text-4xl font-serif italic">Смачні рецепти для вас</h1>
        <span className="text-sm font-bold uppercase text-gray-400">Всього: {recipes.length}</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </main>
  );
}
