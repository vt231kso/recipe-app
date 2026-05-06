import { DirectoryTable } from "@/components/admin/DirectoryTable";
import Link from "next/link";
import { Plus } from "lucide-react";
import { adminService } from "@/lib/services/admin.service";


export default async function DietaryNeedsAdminPage() {
  const items = await adminService.getAllDietaryNeeds();

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-serif">Дієтичні потреби</h1>
        <Link href="/admin/dietary-needs/create" className="bg-black text-white px-5 py-3 rounded-2xl flex gap-2 items-center">
          <Plus size={20}/> Додати
        </Link>
      </div>
      <DirectoryTable items={items} type="dietaryNeed" title="дієти" />
    </div>
  );
}
