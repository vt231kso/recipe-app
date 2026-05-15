"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function useRecipeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilter = (key: string, values: string[] | string) => {
    const params = new URLSearchParams(searchParams.toString());

    const valueStr = Array.isArray(values) ? values.join(",") : values;

    if (valueStr.length > 0) {
      params.set(key, valueStr);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    startTransition(() => {
      router.push(`/recipes?${params.toString()}`, { scroll: false });
    });
  };

  const resetFilters = () => {
    startTransition(() => {
      router.push("/recipes", { scroll: false });
    });
  };

  const hasFilters = searchParams.toString().length > 0;

  return {
    updateFilter,
    resetFilters,
    isPending,
    hasFilters,
    searchParams
  };
}
