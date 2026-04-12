import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchSavedRecipes } from "@/actions/recipe";
import RecipeCard from "@/components/RecipeCard";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  const userId = Number(session.user.id);
  const savedRecipes = await fetchSavedRecipes(userId);
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      {/* Секція інформації про користувача */}
      <section>
        <h1 className="text-3xl font-serif mb-6 text-gray-900">Мій профіль</h1>
        <div className="bg-white shadow-sm rounded-3xl p-8 border border-gray-100 flex flex-col gap-2">
          <p className="text-gray-600"><strong>Ім&#39;я:</strong> {session.user?.name}</p>
          <p className="text-gray-600"><strong>Email:</strong> {session.user?.email}</p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-4xl font-serif text-gray-900">Збережені рецепти</h2>
          <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm font-bold">
            {savedRecipes.length}
          </span>
        </div>

        {savedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-serif text-xl">Ви ще не зберегли жодного рецепта.</p>
            <p className="text-[#86E377] font-bold mt-2 hover:underline cursor-pointer">
              <Link href="/">Перейти до каталогу</Link>
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
