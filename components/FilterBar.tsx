"use client";
import { useState, useRef, useEffect, ReactElement } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterOptions, SelectOption } from "@/types/recipe";
import { useTransition } from "react";

interface FilterBarProps {
  options: FilterOptions;
}

export default function FilterBar({ options }: FilterBarProps): ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const hasFilters = searchParams.toString().length > 0;
  const updateFilter = (key: string, values: string[]): void => {
    const params = new URLSearchParams(searchParams.toString());
    if (values.length > 0) {
      params.set(key, values.join(","));
    } else {
      params.delete(key);
    }

    startTransition(() => {
      router.push(`/recipes?${params.toString()}`, { scroll: false });
    });
  };

  const resetFilters = (): void => {
    startTransition(() => {
      router.push("/recipes", { scroll: false });
    });
  };
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

interface MultiSelectProps {
  label: string;
  options: SelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
}

function MultiSelect({ label, options, selected, onChange }: MultiSelectProps): ReactElement {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const toggle = (val: string): void => {
    const next = selected.includes(val)
      ? selected.filter((i) => i !== val)
      : [...selected, val];
    onChange(next);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-5 py-2.5 rounded-full border text-sm font-bold transition-all flex items-center gap-2 ${
          selected.length > 0
            ? "bg-[#F7FFF5] border-[#86E377] text-gray-900 shadow-sm"
            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
        }`}
      >
        {label} {selected.length > 0 && (
        <span className="text-[11px] bg-[#86E377] text-white px-2 py-0.5 rounded-full">
            {selected.length}
          </span>
      )}
        <span className={`transition-transform duration-200 text-[10px] ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white shadow-2xl rounded-2xl p-4 z-[100] border border-gray-50 max-h-96 overflow-y-auto">
          <div className="grid gap-1">
            {options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-xl cursor-pointer group transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(opt.value)}
                  onChange={() => toggle(opt.value)}
                  className="w-5 h-5 rounded border-gray-300 text-[#86E377] focus:ring-[#86E377] focus:ring-offset-0 cursor-pointer accent-[#86E377]"
                />
                <span className={`text-sm transition-colors ${
                  selected.includes(opt.value)
                    ? "font-bold text-gray-900"
                    : "text-gray-600 group-hover:text-gray-900"
                }`}>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
