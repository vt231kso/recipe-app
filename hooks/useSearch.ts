"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface UseSearchReturn {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}

export function useSearch(): UseSearchReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("query") || "";

  const [query, setQuery] = useState<string>(urlQuery);

  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setQuery(urlQuery);
  }

  useEffect(() => {

    if (query === urlQuery) return;

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("query", query);
      } else {
        params.delete("query");
      }
      router.push(`/recipes?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, router, searchParams, urlQuery]);

  return { query, setQuery };
}
