import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { CommentDeleteButton } from "./CommentDeleteButton";

interface Props {
  comment: {
    id: number;
    text: string;
    createdAt: Date;
    user: { name: string | null; email: string };
    recipe: { id: number; title: string };
  };
}

export function CommentCard({ comment }: Props) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between gap-4 hover:border-red-100 transition-colors">
      <div className="space-y-3 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-bold text-gray-900">
            {comment.user.name || "Анонім"}
          </span>
          <span className="text-gray-400">({comment.user.email})</span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-500">до рецепту:</span>
          <Link
            href={`/recipes/${comment.recipe.id}`}
            className="text-green-600 font-medium hover:underline flex items-center gap-1"
          >
            {comment.recipe.title} <ExternalLink size={14} />
          </Link>
        </div>

        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-50">
          {comment.text}
        </p>

        <div className="text-xs text-gray-400">
          {new Date(comment.createdAt).toLocaleString("uk-UA", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      <div className="flex md:flex-col justify-end">
        <CommentDeleteButton id={comment.id} />
      </div>
    </div>
  );
}
