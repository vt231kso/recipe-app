import { prisma } from "@/lib/prisma";
import { UserForm } from "@/components/admin/UserForm";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: PageProps) {
  const resolvedParams = await params;
  const user = await prisma.user.findUnique({
    where: { id: Number(resolvedParams.id) },
  });

  if (!user) notFound();

  return (
    <div className="p-8 space-y-6">
    <h1 className="text-3xl font-bold font-serif">Редагувати профіль</h1>
  <UserForm
  initialData={{
    id: user.id,
      name: user.name || "",
      email: user.email,
      role: user.role
  }}
  />
  </div>
);
}
