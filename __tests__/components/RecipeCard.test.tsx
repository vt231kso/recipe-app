import { render, screen } from '@testing-library/react';
import RecipeCard from '@/components/RecipeCard';
import { RecipePreview } from '@/types/recipe';

const createMockRecipe = (overrides: Partial<RecipePreview> = {}): RecipePreview => ({
  id: 1,
  title: 'Тестовий рецепт',
  imageUrl: '/test.jpg',
  cookingTime: 30,
  difficulty: 'Easy',
  category: { name: 'Сніданки' },
  author: { name: 'Софія' },
  likes: [],
  savedBy: [],
  _count: { likes: 0, savedBy: 0 },
  ...overrides,
});

describe('RecipeCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('має відображати основну інформацію: назву, категорію, автора та час', () => {
    const recipe = createMockRecipe({
      title: 'Гарбузовий суп',
      author: { name: 'Олександр' },
      cookingTime: 45
    });

    render(<RecipeCard recipe={recipe} />);

    expect(screen.getByText('Гарбузовий суп')).toBeInTheDocument();
    expect(screen.getByText('Олександр')).toBeInTheDocument();
    expect(screen.getByText(/45 хв/)).toBeInTheDocument();
    expect(screen.getAllByText(/Сніданки/i)[0]).toBeInTheDocument();
  });

  it('має відображати активний червоний лайк, якщо користувач уже лайкнув рецепт', () => {
    const currentUserId = 505;
    const recipe = createMockRecipe({
      likes: [{ userId: currentUserId }],
      _count: { likes: 1, savedBy: 0 }
    });

    render(<RecipeCard recipe={recipe} currentUserId={currentUserId} />);

    const likeBtn = screen.getByRole('button', { name: /Прибрати лайк/i });
    expect(likeBtn).toBeInTheDocument();

    const countLabel = screen.getByText('1');
    expect(countLabel).toHaveClass('text-red-600');

    const heartIcon = likeBtn.querySelector('svg');
    expect(heartIcon).toHaveClass('fill-red-500');
    expect(heartIcon).toHaveClass('text-red-500');
  });


  it('має відображати "Середній" рівень складності, якщо поле difficulty відсутнє', () => {
    const recipe = createMockRecipe({ difficulty: undefined });


    render(<RecipeCard recipe={recipe} />);
    expect(screen.getByText('Середній')).toBeInTheDocument();
  });


  it('посилання має вести на правильну сторінку та мати опис для скрінрідерів', () => {
    const recipe = createMockRecipe({ id: 99, title: 'Млинці' });

    render(<RecipeCard recipe={recipe} />);

    const link = screen.getByRole('link', { name: /Переглянути рецепт: Млинці/i });
    expect(link).toHaveAttribute('href', '/recipes/99');
  });

  it('має використовувати placeholder.jpg, якщо imageUrl не вказано', () => {
    const recipe = createMockRecipe({ imageUrl: '' });

    render(<RecipeCard recipe={recipe} />);

    const img = screen.getByAltText('Тестовий рецепт');

    expect(img).toHaveAttribute('src', expect.stringContaining('placeholder.jpg'));
  });
});
