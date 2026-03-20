import { Prisma } from "@prisma/client";
export type RecipeWithDetails = Prisma.RecipeGetPayload<{
  include: {
    category: true;
    author: true;
    steps?: true;
    ingredients?: {
      include: {
        ingredient: true;
      };
    };
  };
}>;
