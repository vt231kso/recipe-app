import { PrismaClient } from '@prisma/client';
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


async function main() {
  // 1. Очищення бази (важливо для уникнення конфліктів @unique)
  await prisma.recipeIngredient.deleteMany()
  await prisma.ingredient.deleteMany()
  await prisma.step.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.recipe.deleteMany()
  await prisma.category.deleteMany()
  await prisma.cuisine.deleteMany()
  await prisma.dietaryNeed.deleteMany()
  await prisma.user.deleteMany()

  // 2. Створення 3-х Користувачів
  const sofia = await prisma.user.create({
    data: { email: 'sofia@kashpurenko.com', name: 'Софія Олександрівна', password: 'adminpassword', role: 'ADMIN' }
  })
  const oleg = await prisma.user.create({
    data: { email: 'oleg@gmail.com', name: 'Олег Іваненко', password: 'userpassword' }
  })
  const maria = await prisma.user.create({
    data: { email: 'maria@ukr.net', name: 'Марія Ковальчук', password: 'userpassword' }
  })

  // 3. Категорії та Кухні
  const catBreakfast = await prisma.category.create({ data: { name: 'Сніданки', slug: 'breakfast' } })
  const catLunch = await prisma.category.create({ data: { name: 'Обіди', slug: 'lunch' } })
  const catDinner = await prisma.category.create({ data: { name: 'Вечері', slug: 'dinner' } })
  const catDessert = await prisma.category.create({ data: { name: 'Десерти', slug: 'desserts' } })

  const cuiUkr = await prisma.cuisine.create({ data: { name: 'Українська' } })
  const cuiIta = await prisma.cuisine.create({ data: { name: 'Італійська' } })
  const cuiAsian = await prisma.cuisine.create({ data: { name: 'Азіатська' } })

  // 4. Інгредієнти (Словник)
  const ingMilk = await prisma.ingredient.create({ data: { name: 'Молоко' } })
  const ingEggs = await prisma.ingredient.create({ data: { name: 'Яйця' } })
  const ingFlour = await prisma.ingredient.create({ data: { name: 'Борошно' } })
  const ingPasta = await prisma.ingredient.create({ data: { name: 'Паста' } })
  const ingCheese = await prisma.ingredient.create({ data: { name: 'Сир Пармезан' } })
  const ingChicken = await prisma.ingredient.create({ data: { name: 'Куряче філе' } })

  // 5. Рецепти

  // РЕЦЕПТ 1: Млинці (Автор: Софія)
  await prisma.recipe.create({
    data: {
      title: 'Домашні млинці на молоці',
      description: 'Тоненькі млинці, що ідеально пасують до сніданку.',
      cookingTime: 25,
      difficulty: 'EASY',
      authorId: sofia.id,
      categoryId: catBreakfast.id,
      cuisineId: cuiUkr.id,
      steps: {
        create: [
          { order: 1, content: 'Змішати яйця з молоком.' },
          { order: 2, content: 'Додати борошно і випікати на пательні.' }
        ]
      },
      ingredients: {
        create: [
          { ingredientId: ingMilk.id, amount: '500', unit: 'мл' },
          { ingredientId: ingEggs.id, amount: '3', unit: 'шт' },
          { ingredientId: ingFlour.id, amount: '250', unit: 'г' }
        ]
      }
    }
  })

  // РЕЦЕПТ 2: Карбонара (Автор: Олег)
  await prisma.recipe.create({
    data: {
      title: 'Справжня Італійська Карбонара',
      description: 'Класичний рецепт без вершків.',
      cookingTime: 15,
      difficulty: 'MEDIUM',
      authorId: oleg.id,
      categoryId: catLunch.id,
      cuisineId: cuiIta.id,
      steps: {
        create: [
          { order: 1, content: 'Відварити пасту до стану аль-денте.' },
          { order: 2, content: 'Змішати жовтки з сиром та додати до гарячої пасти.' }
        ]
      },
      ingredients: {
        create: [
          { ingredientId: ingPasta.id, amount: '200', unit: 'г' },
          { ingredientId: ingCheese.id, amount: '50', unit: 'г' },
          { ingredientId: ingEggs.id, amount: '2', unit: 'шт (жовтки)' }
        ]
      }
    }
  })

  // РЕЦЕПТ 3: Курячий суп (Автор: Марія)
  await prisma.recipe.create({
    data: {
      title: 'Легкий курячий бульйон',
      description: 'Зігріваючий суп для всієї родини.',
      cookingTime: 60,
      difficulty: 'MEDIUM',
      authorId: maria.id,
      categoryId: catLunch.id,
      cuisineId: cuiUkr.id,
      steps: {
        create: [
          { order: 1, content: 'Відварити курку протягом 40 хвилин.' },
          { order: 2, content: 'Додати овочі та спеції за смаком.' }
        ]
      },
      ingredients: {
        create: [
          { ingredientId: ingChicken.id, amount: '400', unit: 'г' }
        ]
      }
    }
  })

  console.log('✅ База успішно заповнена: 3 юзери, 4 категорії, 3 кухні, 3 рецепти.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
