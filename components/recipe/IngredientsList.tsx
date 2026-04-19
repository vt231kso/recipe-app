import { RecipeWithDetails } from "@/types/recipe";

export default function IngredientsList({ ingredients }: { ingredients: RecipeWithDetails['ingredients'] }) {
  return (
    <section className="relative">
      <div className="absolute -left-4 -top-4 w-24 h-24 bg-[#86E377]/10 rounded-full blur-3xl hidden md:block" />
      <div className="bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 md:w-2 bg-[#86E377]" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 md:mb-10 gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#86E377] rounded-2xl flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-4xl font-serif text-gray-900">Інгредієнти</h2>
          </div>
          <span className="bg-[#F3F1E9] px-3 py-1.5 rounded-xl font-bold text-gray-500 text-sm uppercase tracking-tighter">
            {ingredients?.length || 0} позицій
          </span>
        </div>

        <ul className="grid grid-cols-1 gap-y-4">
          {ingredients?.map((item) => (
            <li key={`${item.recipeId}-${item.ingredientId}`} className="flex items-center group py-2 md:py-3 px-2 md:px-4 rounded-2xl hover:bg-[#FDFCF9] transition-colors">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#86E377] mr-4 shadow-[0_0_10px_rgba(134,227,119,0.5)]" />
              <span className="text-base md:text-xl text-gray-700 font-medium group-hover:text-black">
                {item.ingredient.name}
              </span>
              <div className="hidden xs:block flex-grow border-b-2 border-dotted border-gray-200 group-hover:border-[#86E377]/30 mx-4 mt-3" />
              <div className="ml-auto text-right">
                <span className="text-base md:text-xl font-black text-gray-900">{item.amount}</span>
                <span className="ml-1 text-[10px] md:text-s font-bold text-gray-400 uppercase">{item.unit}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
