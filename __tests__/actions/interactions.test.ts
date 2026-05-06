import { rateRecipe } from "@/actions/rate";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

jest.mock("@/auth");

jest.mock("@/lib/prisma", () => ({
  prisma: {
    rating: {
      upsert: jest.fn(),
    },
  },
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("Interactions - Rating", () => {
  const recipeId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("блокує оцінку, якщо користувач не авторизований", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const result = await rateRecipe(recipeId, 5);

    expect(result.error).toBe("AUTH_REQUIRED");
    expect(result.message).toContain("увійдіть");
  });

  it("блокує оцінку, якщо вона виходить за межі 1-5 зірок", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "1" } });

    const result = await rateRecipe(recipeId, 10);

    expect(result.error).toBe("INVALID_VALUE");
    expect(result.message).toContain("від 1 до 5");
  });

  it("успішно оновлює або створює оцінку через upsert", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "1" } });
    (prisma.rating.upsert as jest.Mock).mockResolvedValue({ id: 1, value: 5 });

    const result = await rateRecipe(recipeId, 5);

    expect(prisma.rating.upsert).toHaveBeenCalledWith({
      where: {
        userId_recipeId: { userId: 1, recipeId: 1 },
      },
      update: { value: 5 },
      create: { userId: 1, recipeId: 1, value: 5 },
    });
    expect(result.success).toBe(true);
    expect(revalidatePath).toHaveBeenCalled();
  });

  it("обробляє помилку сервера в блоці catch", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "1" } });
    (prisma.rating.upsert as jest.Mock).mockRejectedValue(new Error("DB Connection Error"));

    jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await rateRecipe(recipeId, 5);

    expect(result.error).toBe("SERVER_ERROR");
    expect(result.message).toContain("Не вдалося зберегти оцінку");
  });
});
