import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchSavedRecipes } from "@/actions/recipe";
import { getUser } from "@/actions/user";
import RecipeCard from "@/components/RecipeCard";
import EditProfileForm from "@/components/profile/EditProfileForm";
import Link from "next/link";
import { fetchUserRecipes } from "@/actions/recipe";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
    return null;
  }

  const userId = Number(session.user.id);

  const dbUser = await getUser(userId);

  if (!dbUser) {
    redirect("/login");
  }
  const savedRecipes = await fetchSavedRecipes(userId)||[];
  const myRecipes = await fetchUserRecipes(userId) ||[];
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12 min-h-screen bg-[#FDFCF9]">


      <section className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-4xl font-serif font-bold text-gray-900">Мій кабінет</h1>
          <p className="text-gray-500">Керуйте своїми даними та переглядайте збережені рецепти</p>
        </header>

        <EditProfileForm user={dbUser} />
      </section>
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-serif text-gray-900">Мої рецепти</h2>
          <span className="bg-[#86E377] text-black px-3 py-1 rounded-full text-sm font-bold">
           {myRecipes?.length || 0}
          </span>
        </div>

        {myRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {myRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} currentUserId={userId}/>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
            <p className="text-gray-600">Ви ще не опублікували жодного рецепта.</p>
            <Link href="/recipes/create" className="inline-flex items-center min-h-[44px] text-[#4E9F3D] font-bold hover:underline">
              Створити перший рецепт
            </Link>
          </div>
        )}
      </section>
      <hr className="border-gray-100" />

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-serif text-gray-900">Збережені рецепти</h2>
            <span className="bg-[#86E377]/10 text-[#65B756] px-4 py-1 rounded-full text-sm font-bold border border-[#86E377]/20">
              {savedRecipes.length || 0}
            </span>
          </div>

          {savedRecipes.length > 0 && (
            <Link href="/" className="text-sm font-bold text-gray-600 hover:text-gray-600 transition-colors">
              Шукати ще рецепти →
            </Link>
          )}
        </div>

        {savedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} currentUserId={userId} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-gray-100 flex flex-col items-center">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-gray-600 font-serif text-xl">Ваша кулінарна книга поки порожня.</p>
            <Link
              aria-label="Перейти до пошуку рецептів"
              href="/"
              className="text-sm font-bold text-gray-600 hover:text-gray-800 transition-colors min-h-[44px] flex items-center"
            >
              Знайти смачненьке
            </Link>
          </div>
        )}
      </section>

    </div>
  );
}
