import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';

// Створюємо глибокий мок для PrismaClient
export const prismaMock = mockDeep<PrismaClient>();

// Скидаємо стан моків перед кожним тестом, щоб вони не впливали один на одного
beforeEach(() => {
  mockReset(prismaMock);
});

// Експортуємо мок як те, що повертатиметься при зверненні до lib/prisma
export const prisma = prismaMock;
