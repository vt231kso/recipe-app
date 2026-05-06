import {
  fetchRecipeById,
  fetchRecipes,
  fetchEasyRecipes,
  fetchRelatedRecipes,
  fetchFilterOptions,
  fetchFilteredRecipes,
  fetchSavedRecipes,
  fetchTopRatedRecipes
} from '@/actions/recipe';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  prisma: {
    recipe: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    category: { findMany: jest.fn() },
    cuisine: { findMany: jest.fn() },
    dietaryNeed: { findMany: jest.fn() },
    ingredient: { findMany: jest.fn() },
  },
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Recipe Server Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchRecipeById', () => {
    it('має розраховувати середній рейтинг (4.5 для оцінок 5 та 4)', async () => {
      const mockRecipe = {
        id: 1,
        rating: [{ value: 5, userId: 1 }, { value: 4, userId: 2 }],
        _count: { rating: 2, likes: 0, savedBy: 0, comments: 0 },
      };
      (mockedPrisma.recipe.findUnique as jest.Mock).mockResolvedValue(mockRecipe);

      const result = await fetchRecipeById(1);
      expect(result?.avgRating).toBe("4.5");
      expect(result?.totalRatings).toBe(2);
    });

    it('має встановлювати userRating, якщо передано userId', async () => {
      const mockRecipe = {
        id: 1,
        rating: [{ value: 5, userId: 99 }],
        _count: { rating: 1 },
      };
      (mockedPrisma.recipe.findUnique as jest.Mock).mockResolvedValue(mockRecipe);

      const result = await fetchRecipeById(1, 99);
      expect(result?.userRating).toBe(5);
    });

    it('має повертати null для невалідного ID', async () => {
      expect(await fetchRecipeById(NaN)).toBeNull();
    });
  });

  describe('fetchRecipes', () => {
    it('має викликати findMany з обмеженням take: 6', async () => {
      (mockedPrisma.recipe.findMany as jest.Mock).mockResolvedValue([]);
      await fetchRecipes();
      expect(mockedPrisma.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 6 })
      );
    });
  });

  describe('fetchTopRatedRecipes', () => {
    it('має повертати 3 рецепти, відсортовані за кількістю лайків', async () => {
      (mockedPrisma.recipe.findMany as jest.Mock).mockResolvedValue([]);
      await fetchTopRatedRecipes();
      expect(mockedPrisma.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 3,
          orderBy: { likes: { _count: 'desc' } }
        })
      );
    });
  });

  describe('fetchEasyRecipes', () => {
    it('має фільтрувати лише за складністю Easy', async () => {
      (mockedPrisma.recipe.findMany as jest.Mock).mockResolvedValue([]);
      await fetchEasyRecipes();
      expect(mockedPrisma.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { difficulty: 'Easy' }
        })
      );
    });
  });

  describe('fetchFilteredRecipes', () => {
    it('має правильно будувати WHERE запит для текстового пошуку', async () => {
      (mockedPrisma.recipe.findMany as jest.Mock).mockResolvedValue([]);
      await fetchFilteredRecipes({ query: 'паста' });

      expect(mockedPrisma.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { title: { contains: 'паста', mode: 'insensitive' } },
              { description: { contains: 'паста', mode: 'insensitive' } }
            ]
          })
        })
      );
    });

    it('має фільтрувати за часом приготування (lte)', async () => {
      (mockedPrisma.recipe.findMany as jest.Mock).mockResolvedValue([]);
      await fetchFilteredRecipes({ time: '30' });
      expect(mockedPrisma.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            cookingTime: { lte: 30 }
          })
        })
      );
    });
  });

  describe('fetchRelatedRecipes', () => {
    it('має виключати поточний рецепт з результатів (NOT id)', async () => {
      (mockedPrisma.recipe.findMany as jest.Mock).mockResolvedValue([]);
      await fetchRelatedRecipes(5, 1);
      expect(mockedPrisma.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            categoryId: 5,
            NOT: { id: 1 }
          }
        })
      );
    });
  });

  describe('fetchFilterOptions', () => {
    it('має одночасно запитувати категорії, кухні, потреби та інгредієнти', async () => {
      (mockedPrisma.category.findMany as jest.Mock).mockResolvedValue([]);
      (mockedPrisma.cuisine.findMany as jest.Mock).mockResolvedValue([]);
      (mockedPrisma.dietaryNeed.findMany as jest.Mock).mockResolvedValue([]);
      (mockedPrisma.ingredient.findMany as jest.Mock).mockResolvedValue([]);

      const options = await fetchFilterOptions();

      expect(mockedPrisma.category.findMany).toHaveBeenCalled();
      expect(mockedPrisma.ingredient.findMany).toHaveBeenCalledWith({ take: 10 });
      expect(options).toHaveProperty('categories');
      expect(options).toHaveProperty('ingredients');
    });
  });

  describe('fetchSavedRecipes', () => {
    it('має фільтрувати рецепти, збережені конкретним користувачем', async () => {
      (mockedPrisma.recipe.findMany as jest.Mock).mockResolvedValue([]);
      await fetchSavedRecipes(10);
      expect(mockedPrisma.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            savedBy: { some: { userId: 10 } }
          }
        })
      );
    });
  });
});
