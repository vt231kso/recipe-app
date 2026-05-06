import { toggleLike } from "@/actions/like";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

jest.mock("@/auth");
jest.mock("@/lib/prisma", () => ({
  prisma: {
    like: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  },
}));
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("toggleLike Action", () => {
  const recipeId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("повертає AUTH_REQUIRED, якщо користувач не увійшов", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const result = await toggleLike(recipeId);

    expect(result.error).toBe("AUTH_REQUIRED");
    expect(result.message).toContain("Будь ласка, увійдіть");
  });

  it("видаляє лайк, якщо запис вже існує (unliking)", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "10" } });
    (prisma.like.findUnique as jest.Mock).mockResolvedValue({ userId: 10, recipeId: 1 });

    const result = await toggleLike(recipeId);

    expect(prisma.like.delete).toHaveBeenCalledWith({
      where: {
        userId_recipeId: { userId: 10, recipeId: 1 }
      }
    });
    expect(result.success).toBe(true);
  });

  it("створює лайк, якщо запису ще немає (liking)", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "10" } });
    (prisma.like.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await toggleLike(recipeId);

    expect(prisma.like.create).toHaveBeenCalledWith({
      data: { userId: 10, recipeId: 1 }
    });
    expect(result.success).toBe(true);
  });

  it("повертає SERVER_ERROR при помилці бази даних", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "10" } });
    (prisma.like.findUnique as jest.Mock).mockRejectedValue(new Error("DB Fail"));

    jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await toggleLike(recipeId);

    expect(result.error).toBe("SERVER_ERROR");
    expect(prisma.like.findUnique).toHaveBeenCalled();
  });
});
