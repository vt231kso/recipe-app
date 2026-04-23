"use client";
import { HeartPulse } from "lucide-react";
import { useFormContext } from "react-hook-form";

export function DietarySelection({ items }: { items: { id: number; name: string }[] }) {
  const { setValue, getValues } = useFormContext();

  return (
    <section className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-green-100 text-green-600 rounded-xl"><HeartPulse size={24} /></div>
        <h2 className="text-2xl font-bold text-gray-900 font-serif">Дієтичні особливості</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((diet) => (
          <label key={diet.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-green-50 transition-all border-2 border-transparent has-[:checked]:border-green-500/20 has-[:checked]:bg-white">
            <input
              type="checkbox"
              className="w-5 h-5 accent-green-600 rounded-lg"
              onChange={(e) => {
                const current = getValues("dietaryIds") || [];
                if (e.target.checked) {
                  setValue("dietaryIds", [...current, diet.id]);
                } else {
                  setValue("dietaryIds", current.filter((id: number) => id !== diet.id));
                }
              }}
            />
            <span className="font-medium text-gray-700">{diet.name}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
