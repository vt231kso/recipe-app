import * as z from "zod";

export const recipeSchema = z.object({
  title: z.string().min(3, "Мінімум 3 символи"),
  description: z.string().min(10, "Мінімум 10 символів"),
  cookingTime: z.coerce.number().int().min(1, "Вкажіть час"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),

  categoryId: z.coerce.number().min(1, "Оберіть категорію"),
  cuisineId: z.coerce.number().min(1, "Оберіть кухню"),

  ingredients: z.array(
    z.object({
      name: z.string().min(1, "Назва обовʼязкова"),
      amount: z.string().min(1, "Кількість обовʼязкова"),
      unit: z.string().min(1, "Одиниця обовʼязкова"),
    })
  ).min(1, "Додайте хоча б 1 інгредієнт"),

  steps: z.array(
    z.object({
      content: z.string().min(5, "Мінімум 5 символів"),
    })
  ).min(1, "Додайте хоча б 1 крок"),
  image: z.any().optional(),
  dietaryIds: z.array(z.coerce.number()).optional().default([]),
});

export type RecipeFormValues = z.infer<typeof recipeSchema>;
