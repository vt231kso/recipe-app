import { updateProfile, updatePassword } from "@/actions/user";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

jest.mock("@/auth");
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));
jest.mock("bcryptjs");

describe("User Actions", () => {
  const mockSession = { user: { id: "1" } };

  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue(mockSession);
  });

  describe("updateProfile", () => {
    it("має повертати помилку, якщо користувач неавторизований", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const formData = new FormData();
      const result = await updateProfile(formData);
      expect(result.error).toBe("Неавторизовано");
    });

    it("має успішно оновлювати дані користувача", async () => {
      const formData = new FormData();
      formData.append("name", "Нове Ім'я");
      formData.append("email", "new@test.com");

      const result = await updateProfile(formData);

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { name: "Нове Ім'я", email: "new@test.com" }
        })
      );
      expect(result.success).toBe(true);
    });
  });

  describe("updatePassword", () => {
    it("має повертати помилку, якщо паролі не збігаються", async () => {
      const formData = new FormData();
      formData.append("newPassword", "123456");
      formData.append("confirmPassword", "654321");

      const result = await updatePassword(formData);
      expect(result.error).toBe("Нові паролі не збігаються");
    });

    it("має повертати помилку, якщо старий пароль неправильний", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        password: "hashed_old_password"
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const formData = new FormData();
      formData.append("oldPassword", "wrong_password");
      formData.append("newPassword", "new_pass_123");
      formData.append("confirmPassword", "new_pass_123");

      const result = await updatePassword(formData);
      expect(result.error).toBe("Старий пароль введено неправильно");
    });
  });
});
