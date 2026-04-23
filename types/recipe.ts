import { Prisma } from "@prisma/client";
import {
  Category, Cuisine, DietaryNeed, Ingredient } from "@prisma/client";
export type RecipePreview = Prisma.RecipeGetPayload<{
  select: {
    id: true;
    title: true;
    imageUrl: true;
    difficulty: true;
    cookingTime: true;
    category: {
      select: {
        name: true;
      };
    };
    author: {
      select: {
        name: true;
      };
    };
    likes: true,
    savedBy: true,
    _count: { select: { likes: true, savedBy: true } }
  };
}>;

export type PrismaRecipeWithDetails = Prisma.RecipeGetPayload<{
  include: {
    category: true;
    author: true;
    steps: true;
    ingredients: { include: { ingredient: true } };
    likes: true;
    savedBy: true,
    rating: true,
    dietaryNeeds: true,
    comments: {
      include: {
        user: { select: { name: true } },
        replies: {
          include: {
            user: { select: { name: true } }
          }
        }
      }
    },
    _count: { select: { likes: true, savedBy: true,comments:true,rating: true } }
  };
}>;
export type RecipeWithDetails = PrismaRecipeWithDetails & {
  avgRating: string;
  userRating: number;
  totalRatings: number;
};
export type FilterOptions = {
  categories: Category[];
  cuisines: Cuisine[];
  dietaryNeeds: DietaryNeed[];
  ingredients: Ingredient[];
};

export type SelectOption = {
  label: string;
  value: string;
};
