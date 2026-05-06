import { adminService } from "@/lib/services/admin.service";
import { DirectoryForm } from "@/components/admin/DirectoryForm";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategory({ params }: PageProps) {
  const { id: stringId } = await params;
  const id = Number(stringId);

  const category = await adminService.getDirectoryItemById("category", id);

  if (!category) {
     notFound();
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold font-serif">Редагувати категорію</h1>
      </div>

      <DirectoryForm
        key={id}
        type="category"
        initialData={{ id: category.id, name: category.name }}
      />
    </div>
  );
}
