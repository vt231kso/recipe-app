import { adminService } from "@/lib/services/admin.service";
import { DirectoryForm } from "@/components/admin/DirectoryForm";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDietaryPage({ params }: PageProps) {
  const { id: stringId } = await params;
  const id = Number(stringId);

  const item = await adminService.getDirectoryItemById("dietaryNeed", id);

  if (!item) return notFound();

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold font-serif">Редагувати дієту</h1>
      <DirectoryForm
        key={id}
        type="dietaryNeed"
        initialData={{ id: item.id, name: item.name }}
      />
    </div>
  );
}
