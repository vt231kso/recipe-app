import { DirectoryForm } from "@/components/admin/DirectoryForm";

export default function NewCategory() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Нова категорія</h1>
      <DirectoryForm type="category" />
    </div>
  );
}
