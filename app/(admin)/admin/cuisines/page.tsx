import { DirectoryTable } from "@/components/admin/DirectoryTable";
import Link from "next/link";
import { Plus } from "lucide-react";
import { adminService } from "@/lib/services/admin.service";

export default async function CuisinesAdminPage() {
  const items = await adminService.getAllCuisines();

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-serif">Кухні світу</h1>
        <Link href="/admin/cuisines/create" className="bg-black text-white px-5 py-3 rounded-2xl flex gap-2 items-center hover:bg-gray-800 transition-all">
          <Plus size={20}/> Додати
        </Link>
      </div>
      <DirectoryTable items={items} type="cuisine" title="кухні" />
    </div>
  );
}
