// types/recipe.ts
export interface RecipeWithDetails {
  id: number;
  title: string;
  imageUrl: string | null;
  difficulty: string | null;
  cookingTime: number;
  category: {
    name: string;
  };
  author: {
    name: string | null;
  };
}
