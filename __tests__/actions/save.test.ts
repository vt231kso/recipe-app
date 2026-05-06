import { toggleSave } from "@/actions/save";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    savedRecipe: {
      findUnique: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    },
  },
}));
jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

describe("Save Actions", () => {
  it("toggleSave видаляє рецепт, якщо він вже був збережений", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "1" } });
    (prisma.savedRecipe.findUnique as jest.Mock).mockResolvedValue({ userId: 1, recipeId: 1 });

    const result = await toggleSave(1);

    expect(prisma.savedRecipe.delete).toHaveBeenCalled();
    expect(result.success).toBe(true);
  });

  it("toggleSave повертає помилку сервера при збої", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "1" } });
    (prisma.savedRecipe.findUnique as jest.Mock).mockRejectedValue(new Error("Fatal"));

    const result = await toggleSave(1);
    expect(result.error).toBe("SERVER_ERROR");
  });
});
