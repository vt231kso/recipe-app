import { recipeSchema } from "@/lib/validations/recipe";

describe("Recipe Validation Schema", () => {


  it("має успішно валідувати правильні дані", () => {
    const validData = {
      title: "Гарбузовий суп",
      description: "Дуже смачний осінній суп з вершками",
      cookingTime: 45,
      difficulty: "Easy",
      categoryId: 1,
      cuisineId: 2,
      ingredients: [{ name: "Гарбуз", amount: "500", unit: "г" }],
      steps: [{ content: "Порізати гарбуз кубиками" }],
      dietaryIds: [1, 2]
    };

    const result = recipeSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("має повертати помилку для короткого заголовка та опису", () => {
    const invalidData = {
      title: "А",
      description: "Коротко",
      cookingTime: 30,
      difficulty: "Medium",
      categoryId: 1,
      cuisineId: 1,
      ingredients: [{ name: "Тест", amount: "1", unit: "шт" }],
      steps: [{ content: "Крок 1" }]
    };

    const result = recipeSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.title).toContain("Мінімум 3 символи");
      expect(errors.description).toContain("Мінімум 10 символів");
    }
  });


  it("має вимагати хоча б один інгредієнт та один крок", () => {
    const emptyArrays = {
      title: "Валідний заголовок",
      description: "Достатньо довгий опис рецепту",
      cookingTime: 20,
      difficulty: "Hard",
      categoryId: 1,
      cuisineId: 1,
      ingredients: [],
      steps: []
    };

    const result = recipeSchema.safeParse(emptyArrays);
    expect(result.success).toBe(false);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.ingredients).toContain("Додайте хоча б 1 інгредієнт");
      expect(errors.steps).toContain("Додайте хоча б 1 крок");
    }
  });


  it("має повертати помилку, якщо час приготування менше 1", () => {
    const result = recipeSchema.safeParse({
      cookingTime: 0
    });

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.cookingTime).toContain("Вкажіть час");
    }
  });
});
