import { prepareRecipeData, formatPrismaRecipeData } from "@/lib/recipe-utils";

describe("Recipe Utils", () => {
  it("prepareRecipeData має правильно парсити FormData", () => {
    const formData = new FormData();
    formData.append("title", "Тестовий рецепт");
    formData.append("ingredients", JSON.stringify([{ name: "Tomato", amount: "2", unit: "pcs" }]));
    formData.append("steps", JSON.stringify([{ content: "Step 1" }]));

    const result = prepareRecipeData(formData);
    expect(result.title).toBe("Тестовий рецепт");
    expect(result.ingredientsData).toHaveLength(1);
    expect(result.ingredientsData[0].name).toBe("Tomato");
  });

  it("formatPrismaRecipeData має створювати структуру для Prisma", () => {
    const mockData:ReturnType<typeof prepareRecipeData> = {
      title: "Pasta",
      description: "Easy pasta",
      cookingTime: 20,
      difficulty: "EASY",
      categoryId: 1,
      cuisineId: 1,
      dietaryIds: [1, 2],
      ingredientsData: [{ name: "Salt", amount: "1", unit: "tsp" }],
      stepsData: [{ content: "Boil water" }]
    };

    const result = formatPrismaRecipeData(mockData, "http://image.jpg");

    expect(result.title).toBe("Pasta");
    expect(result.imageUrl).toBe("http://image.jpg");
    expect(result.ingredients?.create).toBeDefined();
    expect(result.ingredients?.create).toHaveLength(1);
    expect(result.ingredients.create[0].ingredient.connectOrCreate.where.name).toBe("salt");
  });
});
