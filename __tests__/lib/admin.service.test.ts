import { adminService } from "@/lib/services/admin.service";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      count: jest.fn(),
      findMany: jest.fn()
    },
    recipe: {
      count: jest.fn(),
      findMany: jest.fn(),
      aggregate: jest.fn()
    },
    comment: {
      count: jest.fn(),
      findMany: jest.fn()
    },
    category: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn()
    },
    cuisine: { findMany: jest.fn(), findUnique: jest.fn() },
    dietaryNeed: { findMany: jest.fn(), findUnique: jest.fn() },
    ingredient: { findMany: jest.fn(), findUnique: jest.fn() }
  }
}));

describe("Admin Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getStats має повертати статистику навіть при порожніх даних", async () => {
    (prisma.user.count as jest.Mock).mockResolvedValue(10);
    (prisma.recipe.count as jest.Mock).mockResolvedValue(5);
    (prisma.comment.count as jest.Mock).mockResolvedValue(20);
    (prisma.recipe.aggregate as jest.Mock).mockResolvedValue({ _avg: { cookingTime: null } });
    (prisma.category.findFirst as jest.Mock).mockResolvedValue(null);

    const stats = await adminService.getStats();

    expect(stats.users).toBe(10);
    expect(stats.avgTime).toBe(0);
    expect(stats.popularCategory).toBe("—");
  });

  it("getAllUsers має повертати список користувачів", async () => {
    const mockUsers = [{ id: 1, name: "Sofiia" }];
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

    const result = await adminService.getAllUsers();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Sofiia");
  });

  it("getAllTableData має повертати об'єкт з усіма категоріями довідників", async () => {
    (prisma.category.findMany as jest.Mock).mockResolvedValue([{ id: 1 }]);
    (prisma.cuisine.findMany as jest.Mock).mockResolvedValue([{ id: 1 }]);
    (prisma.dietaryNeed.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.ingredient.findMany as jest.Mock).mockResolvedValue([]);

    const result = await adminService.getAllTableData();

    expect(result).toHaveProperty("categories");
    expect(result).toHaveProperty("cuisines");
    expect(prisma.category.findMany).toHaveBeenCalled();
    expect(prisma.cuisine.findMany).toHaveBeenCalled();
  });

  it("getAllIngredients та інші прості методи мають повертати дані", async () => {
    (prisma.ingredient.findMany as jest.Mock).mockResolvedValue([{ name: "Tomato" }]);
    const result = await adminService.getAllIngredients();
    expect(result[0].name).toBe("Tomato");
  });

  it("getDirectoryItemById має працювати для різних типів моделей", async () => {
    (prisma.ingredient.findUnique as jest.Mock).mockResolvedValue({ id: 5, name: "Salt" });

    const result = await adminService.getDirectoryItemById("ingredient", 5);
    expect(result!.name).toBe("Salt");
    expect(prisma.ingredient.findUnique).toHaveBeenCalledWith({ where: { id: 5 } });
  });
});
