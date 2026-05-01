import { prisma } from "@/lib/prisma";

export async function getAllCommentsForAdmin() {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        },
        recipe: {
          select: { id: true, title: true }
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return comments;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не вдалося завантажити коментарі.");
  }
}
