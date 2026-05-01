import { DirectoryForm } from "@/components/admin/DirectoryForm";

export default function CreateCuisinePage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold font-serif">Нова кухня</h1>
      <DirectoryForm type="cuisine" />
    </div>
  );
}
