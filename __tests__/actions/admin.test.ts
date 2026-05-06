import { deleteUserAction} from "@/actions/admin";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

jest.mock("@/auth");
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      delete: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe("Admin Actions - Security Check", () => {
  it("має викидати помилку, якщо звичайний користувач намагається видалити юзера", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { role: "USER" } });

    await expect(deleteUserAction(99)).rejects.toThrow("Доступ заборонено: ви не адміністратор");
  });

  it("має дозволити видалення, якщо роль — ADMIN", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { role: "ADMIN" } });
    (prisma.user.delete as jest.Mock).mockResolvedValue({ id: 99 });

    const result = await deleteUserAction(99);

    expect(result.success).toBe(true);
    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { id: 99 }
    });
  });
});
