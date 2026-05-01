import { DirectoryForm } from "@/components/admin/DirectoryForm";

export default function CreateDietaryPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold font-serif">Нова дієта</h1>
      <DirectoryForm type="dietaryNeed" />
    </div>
  );
}
