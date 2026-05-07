import { createRecipe } from "@/actions/create-recipe";
import { updateRecipe } from "@/actions/update-recipe";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    recipe: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    recipeIngredient: { deleteMany: jest.fn() },
    step: { deleteMany: jest.fn() },
    $transaction: jest.fn((cb) => cb(prisma)),
  },
}));

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("@/lib/recipe-utils", () => ({
  handleRecipeImage: jest.fn().mockResolvedValue("http://image.com"),
  prepareRecipeData: jest.fn().mockReturnValue({ title: "Test" }),
  formatPrismaRecipeData: jest.fn().mockReturnValue({ title: "Test Formatted" }),
}));

describe("Recipe Mutations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createRecipe", () => {
    it("має повертати помилку, якщо користувач не авторизований", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const result = await createRecipe(new FormData());
      expect(result).toEqual({ error: "Необхідна авторизація" });
    });

    it("має успішно створювати рецепт", async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: "1" } });
      (prisma.recipe.create as jest.Mock).mockResolvedValue({ id: 123 });

      const formData = new FormData();
      const result = await createRecipe(formData);

      expect(result).toEqual({ success: true, recipeId: 123 });
      expect(revalidatePath).toHaveBeenCalledWith("/recipes");
    });
  });

  describe("updateRecipe", () => {
    it("має повертати помилку, якщо користувач не є автором або адміном", async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: "1", role: "USER" } });
      (prisma.recipe.findUnique as jest.Mock).mockResolvedValue({ authorId: 999 });

      const formData = new FormData();
      formData.append("id", "123");

      const result = await updateRecipe(formData);
      expect(result).toEqual({ error: "Немає прав" });
    });

    it("має дозволити оновлення, якщо користувач — ADMIN", async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: "1", role: "ADMIN" } });
      (prisma.recipe.findUnique as jest.Mock).mockResolvedValue({ authorId: 999 });
      (prisma.recipe.update as jest.Mock).mockResolvedValue({ id: 123 });

      const formData = new FormData();
      formData.append("id", "123");

      const result = await updateRecipe(formData);
      expect(result.success).toBe(true);
    });
  });
});
