import { render, screen } from "@testing-library/react";
import ProfilePage from "@/app/profile/page";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchSavedRecipes, fetchUserRecipes } from "@/actions/recipe";
import { getUser } from "@/actions/user";

jest.mock("@/auth");
jest.mock("next/navigation");
jest.mock("@/actions/recipe");
jest.mock("@/actions/user");

describe("ProfilePage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("має редіректити на /login, якщо сесія відсутня", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    await ProfilePage();

    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("має редіректити на /login, якщо користувача немає в базі даних", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "1" } });
    (getUser as jest.Mock).mockResolvedValue(null);

    await ProfilePage();

    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("має відображати кількість рецептів користувача", async () => {
    const mockUser = { id: 1, name: "Софія", email: "test@test.com" };
    const mockRecipes = [{ id: 101, title: "Рецепт 1" }, { id: 102, title: "Рецепт 2" }];

    (auth as jest.Mock).mockResolvedValue({ user: { id: "1" } });
    (getUser as jest.Mock).mockResolvedValue(mockUser);
    (fetchUserRecipes as jest.Mock).mockResolvedValue(mockRecipes);
    (fetchSavedRecipes as jest.Mock).mockResolvedValue([]);

    const Page = await ProfilePage();
    render(Page);

    expect(screen.getByText("Мій кабінет")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
