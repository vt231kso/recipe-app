// types/recipe.ts
import { Prisma } from "@prisma/client";

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
  };
}>;

export type RecipeWithDetails = Prisma.RecipeGetPayload<{
  include: {
    category: true;
    author: true;
    steps: true;
    ingredients: { include: { ingredient: true } };
  };
}>;
