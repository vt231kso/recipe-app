import { fetchRecipeById,fetchRelatedRecipes } from '@/actions/recipe';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import RecipeCard from '@/components/RecipeCard';
import { RecipeWithDetails } from '@/types/recipe';
import Link from 'next/link';

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const recipeId = parseInt(resolvedParams.id);


  const recipe = await fetchRecipeById(recipeId);

  if (!recipe) {
    notFound();
  }

  const relatedRecipes = (await fetchRelatedRecipes(recipe.category.id, recipe.id));
  return (
    <main className="bg-[#FDFCF9] min-h-screen pb-24 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-6 pt-10 md:pt-16 pb-8 md:pb-12 text-cente">
        <span className="bg-[#86E377] px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest text-black inline-block mb-6 md:mb-8 ">
          {recipe.category.name}
        </span>
        <h1 className="text-3xl md:text-6xl font-serif leading-tight text-gray-950 mb-6 md:mb-8 px-2">
          {recipe.title}
        </h1>
        <div className="flex justify-center items-center gap-3 md:gap-6 md:text-sm font-bold text-gray-400 uppercase tracking-widest border-y border-gray-100 py-4 md:py-6">
          <span>⏱ {recipe.cookingTime} хв</span>
          <span className="hidden sm:inline">•</span>
          <span>📊 {recipe.difficulty}</span>
          <span className="hidden sm:inline" >•</span>
          <span className="normal-case italic font-medium text-gray-600 sm:w-auto mt-2 sm:mt-0">
            від {recipe.author.name || 'Аноніма'}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 mb-12 md:mb-20">
        <div className="relative h-[300px] sm:h-[450px] md:h-[650px] w-full rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl border-2 md:border-4 border-white">
          <Image
            src={recipe.imageUrl || '/placeholder.jpg'}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-16 md:space-y-24">

        <section className="relative">

          <div className="absolute -left-4 -top-4 w-24 h-24 bg-[#86E377]/10 rounded-full blur-3xl hidden md:block" />

          <div className="bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0,0.05)] relative overflow-hidden">

            <div className="absolute left-0 top-0 bottom-0 w-1.5 md:w-2  bg-[#86E377]" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 md:mb-10 gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#86E377] rounded-2xl flex items-center justify-center shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-4xl  font-serif text-gray-900">Інгредієнти</h2>
              </div>
              <span className="bg-[#F3F1E9] px-3 py-1.5 rounded-xl font-bold text-gray-500 text-sm uppercase tracking-tighter">
        {recipe.ingredients?.length || 0} позицій
      </span>
            </div>

            <ul className="grid grid-cols-1 gap-y-4">
              {recipe.ingredients?.map((item) => (
                <li
                  key={`${item.recipeId}-${item.ingredientId}`}
                  className="flex items-center group py-2 md:py-3 px-2 md:px-4 rounded-2xl hover:bg-[#FDFCF9] transition-colors"
                >
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#86E377] mr-4 shadow-[0_0_10px_rgba(134,227,119,0.5)]" />

                  <span className="text-base md:text-xl text-gray-700 font-medium group-hover:text-black">
            {item.ingredient.name}
          </span>


                  <div className="hidden xs:block flex-grow border-b-2 border-dotted border-gray-200 group-hover:border-[#86E377]/30 mx-4 mt-3" />

                  <div className="ml-auto text-right">
            <span className="text-base md:text-xl  font-black text-gray-900">
              {item.amount}
            </span>
                    <span className="ml-1 text-[10px] md:text-s font-bold text-gray-400 uppercase">
              {item.unit}
            </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="space-y-10 md:space-y-12">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-5xl font-serif text-gray-900">Спосіб приготування</h2>
          </div>

          <div className="space-y-12 md:space-y-16">
            {recipe.steps?.map((step, index) => (
              <div key={step.id} className="group">

                <div className="inline-block bg-[#F3F1E9] px-4 md:px-6 py-2 rounded-t-2xl border-b-4 border-[#86E377] mb-0 ml-4 shadow-sm">
                  <span className="text-sm font-black text-gray-700 uppercase tracking-tighter">
                    {index + 1}/{recipe.steps?.length}. {step.content.slice(0, 30)}...
                  </span>
                </div>

                <div className="bg-white p-6 md:p-10 rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm space-y-8">
                  <p className="text-lg md:text-2xl text-gray-800 leading-relaxed font-serif italic">
                    {step.content}
                  </p>


                  {step.stepImageUrl && (
                    <div className="relative h-56 md:h-[500px] w-full rounded-[24px] overflow-hidden shadow-inner">
                      <Image
                        src={step.stepImageUrl}
                        alt={`Крок ${step.order}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

          {relatedRecipes.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 md:px-6 mt-20 md:mt-32 pt-16 border-t border-gray-100">
              <div className="flex flex-col mb-12">
                <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-4 text-center md:text-left">Схожі рецепти</h2>
                <p className="text-gray-500 italic text-lg text-center md:text-left">
                  Вам також може сподобатися щось із категорії {recipe.category.name}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-10 gap-y-12 md:gap-y-16">
                {relatedRecipes.map((rel) => (
                  <RecipeCard key={rel.id} recipe={rel} />
                ))}
              </div>
            </section>
          )}
    </main>
  );
}
