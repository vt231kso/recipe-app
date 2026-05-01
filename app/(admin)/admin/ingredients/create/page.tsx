import { DirectoryForm } from "@/components/admin/DirectoryForm";

export default function CreateIngredientPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold font-serif">Новий інгредієнт</h1>
      <DirectoryForm type="ingredient" />
    </div>
  );
}
