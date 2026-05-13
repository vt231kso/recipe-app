import Link from "next/link";
import { FilterParams } from "@/actions/recipe";

interface Props {
  currentPage: number;
  totalPages: number;
  params: FilterParams;
}

export default function Pagination({
                                     currentPage,
                                     totalPages,
                                     params,
                                   }: Props) {
  const createPageLink = (page: number) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value);
      }
    });

    searchParams.set("page", page.toString());

    return `/recipes?${searchParams.toString()}`;
  };

  return (
    <div className="flex justify-center gap-2 mt-16">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={createPageLink(page)}
          className={`px-4 py-2 rounded-xl border transition-all ${
            currentPage === page
              ? "bg-black text-white border-black"
              : "bg-white hover:bg-gray-100 border-gray-200"
          }`}
        >
          {page}
        </Link>
      ))}
    </div>
  );
}
