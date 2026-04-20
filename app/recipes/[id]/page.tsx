import {fetchRecipeById, fetchRelatedRecipes} from '@/actions/recipe';
import Image from 'next/image';
import {notFound} from 'next/navigation';
import RecipeCard from '@/components/RecipeCard';
import LikeButton from '@/components/LikeButton';
import {auth} from "@/auth";
import SaveButton from '@/components/SaveButton';
import CommentsSection from "@/components/recipe/CommentsSection";
import CookingSteps from "@/components/recipe/CookingSteps";
import IngredientsList from "@/components/recipe/IngredientsList";
import StarRating from '@/components/StarRating';


export default async function RecipePage({params}: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const recipeId = parseInt(resolvedParams.id);

  const session = await auth();
  const userId = Number(session?.user?.id);

  const recipe = await fetchRecipeById(recipeId,userId);

  if (!recipe) {
    notFound();
  }
 const isLiked = recipe.likes?.some(like => like.userId === userId) || false;
  const likesCount = recipe._count?.likes || 0;
  const isSaved = recipe.savedBy?.some(save => save.userId === userId) || false;
  const relatedRecipes = (await fetchRelatedRecipes(recipe.category.id, recipe.id));
  return (
    <main className="bg-[#FDFCF9] min-h-screen pb-24 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-6 pt-10 md:pt-16 pb-8 md:pb-12 text-center">
        <div className="flex justify-center items-center gap-4 mb-6">
          <LikeButton
            recipeId={recipeId}
            initialIsLiked={isLiked}
            likesCount={likesCount}
          />
          <div className="w-px h-8 bg-gray-200"/>
          <SaveButton
            recipeId={recipeId}
            initialIsSaved={isSaved}
          />
        </div>
        <div className="flex flex-col items-center gap-3 mb-6 md:mb-8">

          <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <span className="text-yellow-500 text-xl">★</span>
            <span>{recipe.avgRating}</span>
            <span className="text-gray-400 font-medium">({recipe.totalRatings} відгуків)</span>
          </div>
        </div>
        <h1 className="text-3xl md:text-6xl font-serif leading-tight text-gray-950 mb-6 md:mb-8 px-2">
          {recipe.title}
        </h1>
        <div className="flex flex-col items-center gap-2 mb-8">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Оцініть рецепт</p>
          <StarRating recipeId={recipeId} initialRating={recipe.userRating} />
        </div>
        <div
          className="flex justify-center items-center gap-3 md:gap-6 md:text-sm font-bold text-gray-400 uppercase tracking-widest border-y border-gray-100 py-4 md:py-6">
          <span className="text-[#65B756]">{recipe.category.name}</span>
          <span className="hidden sm:inline">•</span>
          <span>⏱ {recipe.cookingTime} хв</span>
          <span className="hidden sm:inline">•</span>
          <span>📊 {recipe.difficulty}</span>
          <span className="hidden sm:inline">•</span>
          <span className="normal-case italic font-medium text-gray-600 sm:w-auto mt-2 sm:mt-0">
            від {recipe.author.name || 'Аноніма'}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 mb-12 md:mb-20">
        <div
          className="relative h-[300px] sm:h-[450px] md:h-[650px] w-full rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl border-2 md:border-4 border-white">
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

        <IngredientsList ingredients={recipe.ingredients}/>
        <CookingSteps steps={recipe.steps}/>
        <CommentsSection recipeId={recipeId} comments={recipe.comments} session={session}
                         count={recipe._count.comments}/>
      </div>

      {relatedRecipes.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 mt-20 md:mt-32 pt-16 border-t border-gray-100">
          <div className="flex flex-col mb-12">
            <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-4 text-center md:text-left">Схожі
              рецепти</h2>
            <p className="text-gray-500 italic text-lg text-center md:text-left">
              Вам також може сподобатися щось із категорії {recipe.category.name}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-10 gap-y-12 md:gap-y-16">
            {relatedRecipes.map((rel) => (
              <RecipeCard key={rel.id} recipe={rel}/>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
