// jest.setup.ts
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { ReadableStream } from 'node:stream/web';

global.TextEncoder = TextEncoder;
global.TextDecoder = (TextDecoder as unknown as typeof global.TextDecoder);
if (typeof global.ReadableStream === 'undefined') {
  // Використовуємо @ts-expect-error замість @ts-ignore
  // Це вказує, що ми свідомо ігноруємо невідповідність типів Node.js та Global
  // @ts-expect-error - ReadableStream types between node and global might mismatch
  global.ReadableStream = ReadableStream;
}
// 2. Мок для @auth/prisma-adapter (вирішує проблему з SyntaxError: export)
jest.mock('@auth/prisma-adapter', () => ({
  PrismaAdapter: jest.fn(() => ({
    createUser: jest.fn(),
    getSessionAndUser: jest.fn(),
    updateUser: jest.fn(),
    linkAccount: jest.fn(),
    createSession: jest.fn(),
  })),
}));

jest.mock('@/auth', () => ({
  auth: jest.fn(() => Promise.resolve({
    user: { id: '1', email: 'test@example.com', name: 'Sofiia' }
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
  handlers: { GET: jest.fn(), POST: jest.fn() },
}));


jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: jest.fn(),
}));

jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('next-auth', () => ({
  __esModule: true,
  default: jest.fn(),
  getServerSession: jest.fn(() => Promise.resolve(null)),
}));
