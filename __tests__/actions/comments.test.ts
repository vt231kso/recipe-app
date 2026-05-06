import {createComment, deleteComment} from "@/actions/comment";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

jest.mock("@/auth");
jest.mock("@/lib/prisma", () => ({
  prisma: {
    comment: {
      findUnique: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    },
  },
}));
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));
describe("Comment Actions", () => {
  it("не дозволяє видалити чужий коментар звичайному користувачу", async () => {

    (auth as jest.Mock).mockResolvedValue({ user: { id: "1", role: "USER" } });


    (prisma.comment.findUnique as jest.Mock).mockResolvedValue({ userId: 2 });

    const result = await deleteComment(100, 50);
    expect(result.error).toBe("У вас немає прав для видалення цього коментаря");
  });

  it("дозволяє адміну видалити будь-який коментар", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "1", role: "ADMIN" } });
    (prisma.comment.findUnique as jest.Mock).mockResolvedValue({ userId: 2 });

    const result = await deleteComment(100, 50);
    expect(result.success).toBe(true);
  });
});
describe("createComment", () => {
  it("повертає помилку, якщо користувач не увійшов", async () => {
    (auth as jest.Mock).mockResolvedValue(null);
    const formData = new FormData();
    formData.append("text", "Привіт");

    const result = await createComment(1, formData);
    expect(result.error).toBe("Ви повинні увійти, щоб коментувати");
  });

  it("повертає помилку, якщо текст занадто короткий", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "1" } });
    const formData = new FormData();
    formData.append("text", " "); // Пустий або 1 символ

    const result = await createComment(1, formData);
    expect(result.error).toBe("Коментар занадто короткий");
  });

  it("успішно створює коментар", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "1" } });
    (prisma.comment.create as jest.Mock).mockResolvedValue({ id: 1 });

    const formData = new FormData();
    formData.append("text", "Дуже класний рецепт!");

    const result = await createComment(1, formData);
    expect(result.success).toBe(true);
    expect(prisma.comment.create).toHaveBeenCalled();
  });

  it("обробляє помилку бази даних при створенні (catch block)", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "1" } });
    (prisma.comment.create as jest.Mock).mockRejectedValue(new Error("DB Error"));

    const formData = new FormData();
    formData.append("text", "Валідний текст");

    const result = await createComment(1, formData);
    expect(result.error).toBe("Не вдалося додати коментар");
  });
});

describe("додаткові кейси deleteComment", () => {
  it("повертає помилку, якщо коментар не знайдено", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "1" } });
    (prisma.comment.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await deleteComment(999, 1);
    expect(result.error).toBe("Коментар не знайдено");
  });

  it("обробляє помилку сервера при видаленні (catch block)", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "1", role: "ADMIN" } });
    (prisma.comment.findUnique as jest.Mock).mockResolvedValue({ userId: 1 });
    (prisma.comment.delete as jest.Mock).mockRejectedValue(new Error("Delete fail"));

    const result = await deleteComment(1, 1);
    expect(result.error).toBe("Помилка при видаленні");
  });
});
