import { fetchRecipes, fetchTopRatedRecipes, fetchEasyRecipes } from '@/actions/recipe'
import RecipeCard from '@/components/RecipeCard'
import Link from 'next/link'
import { Metadata } from 'next'
import {auth} from "@/auth";

export const metadata: Metadata = {
  title: "Головна | Cookie - Рецепти для кожного",
};

export default async function HomePage() {
  const session = await auth();
  const userId = Number(session?.user?.id);
  const [allRecipes, topRated, easyRecipes] = await Promise.all([
    fetchRecipes(),
    fetchTopRatedRecipes(),
    fetchEasyRecipes()
  ]);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 space-y-24">

      {easyRecipes.length > 0 && (
        <section aria-labelledby="easy-recipes-title" className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 id="easy-recipes-title" className="text-3xl font-serif font-bold text-gray-900">
              Легкий старт
            </h2>
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-xs font-black uppercase tracking-widest text-[#65B756] bg-[#86E377]/10 px-3 py-1 rounded-lg">
              Для початківців
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {easyRecipes.map((recipe, index) => (
              <div key={recipe.id} className="transform hover:-translate-y-2 transition-transform duration-300">
                <RecipeCard recipe={recipe}  priority={index < 3}  currentUserId={userId}/>
              </div>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="top-rated-title" className="space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="top-rated-title" className="text-3xl font-serif">Вибір гурманів</h2>
            <p className="text-gray-400 italic">Найпопулярніші рецепти за версією спільноти</p>
          </div>
          <div className="h-px flex-1 mx-8 bg-gray-100 hidden md:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {topRated.map((recipe) => (
            <div key={recipe.id} className="relative group">
              <div aria-hidden="true" className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-xl z-10 shadow-lg font-serif italic">
                #
              </div>
              <RecipeCard recipe={recipe} currentUserId={userId} />
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="latest-recipes-title" className="space-y-12">
        <div className="flex justify-between items-end border-b-2 border-gray-100 pb-6">
          <h2 id="latest-recipes-title" className="text-4xl font-serif italic">Останні новинки</h2>
          <span className="text-sm font-bold uppercase text-gray-400 tracking-widest">
             {allRecipes.length} страв
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {allRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} currentUserId={userId} />
          ))}
        </div>
      </section>

      <section className="bg-[#F3F2EE] rounded-[40px] p-12 text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-serif text-gray-900">Маєте власний секретний рецепт?</h2>
        <p className="text-gray-700 max-w-lg mx-auto">
          Поділіться ним з нашою спільнотою та надихайте тисячі людей на нові кулінарні звершення!
        </p>
        <Link
          href="/recipes/create"
          className="inline-block bg-gray-950 text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-colors"
          aria-label="Перейти до створення нового рецепту"
        >
          Опублікувати рецепт
        </Link>
      </section>
    </main>
  );
}
