export const recipeDefaultValues = {
  title: "",
  description: "",
  cookingTime: 30,
  difficulty: "Medium" as const,
  categoryId: 0,
  cuisineId: 0,
  dietaryIds: [],
  ingredients: [{ name: "", amount: "", unit: "" }],
  steps: [{ content: "" }],
};
