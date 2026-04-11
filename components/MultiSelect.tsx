"use client";

import { useState, useRef, useEffect, ReactElement } from "react";
import { SelectOption } from "@/types/recipe";

interface MultiSelectProps {
  label: string;
  options: SelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
}

export default function MultiSelect({ label, options, selected, onChange }: MultiSelectProps): ReactElement {
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
