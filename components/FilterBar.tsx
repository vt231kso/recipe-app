"use client";
import {ReactElement } from "react";
import { FilterOptions} from "@/types/recipe";
import MultiSelect from "./MultiSelect";
import { useRecipeFilters } from "@/hooks/useRecipeFilters";
interface FilterBarProps {
  options: FilterOptions;
}

export default function FilterBar({ options }: FilterBarProps): ReactElement {
  const { updateFilter, resetFilters, isPending, hasFilters, searchParams } = useRecipeFilters();

  const timeOptions = [
    { label: "До 15 хв", value: "15" },
    { label: "До 30 хв", value: "30" },
    { label: "До 60 хв", value: "60" },
    { label: "До 2 год", value: "120" },
  ];
  return (
    <div className={`flex flex-wrap gap-4 py-8 border-b border-gray-100 transition-opacity duration-300 ${isPending ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
      <MultiSelect
        label="Тип страви"
        selected={searchParams.get("category")?.split(",") || []}
        options={options.categories.map(c => ({ label: c.name, value: c.slug }))}
        onChange={(v) => updateFilter("category", v)}
      />

      <MultiSelect
        label="Кухня"
        selected={searchParams.get("cuisine")?.split(",") || []}
        options={options.cuisines.map(c => ({ label: c.name, value: c.id.toString() }))}
        onChange={(v) => updateFilter("cuisine", v)}
      />

      <MultiSelect
        label="Потреби"
        selected={searchParams.get("dietary")?.split(",") || []}
        options={options.dietaryNeeds.map(d => ({ label: d.name, value: d.id.toString() }))}
        onChange={(v) => updateFilter("dietary", v)}
      />

      <MultiSelect
        label="Інгредієнти"
        selected={searchParams.get("ingredient")?.split(",") || []}
        options={options.ingredients.map(i => ({ label: i.name, value: i.id.toString() }))}
        onChange={(v) => updateFilter("ingredient", v)}
      />
      <MultiSelect
        label="Час приготування"
        selected={searchParams.get("time") ? [searchParams.get("time")!] : []}
        options={timeOptions}
        onChange={(v) => {
          const lastSelected = v.length > 0 ? [v[v.length - 1]] : [];
          updateFilter("time", lastSelected);
        }}
      />
      {isPending && (
        <span className="text-xs text-gray-400 animate-pulse self-center">Оновлюємо...</span>
      )}
      {hasFilters && !isPending && (
        <button
          onClick={resetFilters}
          className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors ml-2 uppercase tracking-widest"
        >
          Очистити все ×
        </button>
      )}
    </div>
  );
}

