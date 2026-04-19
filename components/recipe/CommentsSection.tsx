"use client";

import { useState } from 'react';
import CommentForm from "@/components/CommentForm";
import DeleteCommentButton from "@/components/DeleteCommentButton";
import { RecipeWithDetails } from "@/types/recipe";
import { Session } from "next-auth";
import { ChevronDown, ChevronUp, Reply } from "lucide-react";

interface CommentsSectionProps {
  recipeId: number;
  comments: RecipeWithDetails['comments'];
  session: Session | null;
  count: number;
}

export default function CommentsSection({ recipeId, comments, session, count }: CommentsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [replyTo, setReplyTo] = useState<number | null>(null);

  const LIMIT = 5;
  const visibleComments = showAll ? comments : comments?.slice(0, LIMIT);
  const hasMore = comments && comments.length > LIMIT;

  return (
    <section className="pt-16 border-t border-gray-100">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-4xl font-serif text-gray-900">Відгуки ({count})</h2>
      </div>

      {session ? (
        <div className="mb-12">
          <CommentForm recipeId={recipeId} />
        </div>
      ) : (
        <p className="bg-gray-50 p-6 rounded-2xl text-gray-500 mb-12 italic border border-gray-100">
          Будь ласка, увійдіть, щоб залишити коментар.
        </p>
      )}

      <div className="space-y-6">
        {visibleComments?.map((comment) => {
          const isAuthor = Number(session?.user?.id) === comment.userId;
          const isAdmin = session?.user?.role === "ADMIN";

          return (
            <div key={comment.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
              {/* Головний коментар */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#86E377]/20 rounded-full flex items-center justify-center text-[#2D5A27] font-bold text-xs">
                    {comment.user.name?.[0] || "?"}
                  </div>
                  <span className="font-bold text-gray-900">{comment.user.name || "Анонім"}</span>
                  {(isAuthor || isAdmin) && (
                    <DeleteCommentButton id={comment.id} recipeId={recipeId} />
                  )}
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                  {new Date(comment.createdAt).toLocaleDateString('uk-UA')}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed pl-10">{comment.text}</p>

              {/* Кнопка відповіді */}
              {session && (
                <div className="pl-10 mt-2">
                  <button
                    onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                    className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-[#2D5A27] transition-colors"
                  >
                    <Reply className="w-3 h-3" />
                    {replyTo === comment.id ? "Скасувати" : "Відповісти"}
                  </button>
                </div>
              )}

              {/* Форма для відповіді */}
              {replyTo === comment.id && (
                <div className="pl-10 mt-4 border-l-2 border-[#86E377] ml-4">
                  <CommentForm
                    recipeId={recipeId}
                    parentId={comment.id}
                    onSuccess={() => setReplyTo(null)}
                  />
                </div>
              )}

              {/* Гілка відповідей */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-6 pl-6 md:pl-10 space-y-4 border-l-2 border-gray-50 ml-4 md:ml-5">
                  {comment.replies.map((reply) => {
                    const isReplyAuthor = Number(session?.user?.id) === reply.userId;
                    const isReplyAdmin = session?.user?.role === "ADMIN";

                    return (
                      <div key={reply.id} className="bg-gray-50/70 p-4 rounded-2xl relative">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-gray-400 text-[10px] font-bold shadow-sm">
                              {reply.user.name?.[0] || "?"}
                            </div>
                            <span className="font-bold text-sm text-gray-800">
                              {reply.user.name || "Анонім"}
                            </span>
                            {(isReplyAuthor || isReplyAdmin) && (
                              <DeleteCommentButton id={reply.id} recipeId={recipeId} />
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-gray-400">
                            {new Date(reply.createdAt).toLocaleDateString("uk-UA")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 pl-8 leading-snug">
                          {reply.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Пагінація */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 px-8 py-3 bg-white border-2 border-gray-100 rounded-full text-gray-600 font-bold hover:bg-[#86E377] hover:border-[#86E377] hover:text-black transition-all shadow-sm"
            >
              {showAll ? (
                <>Згорнути <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>Показати всі відгуки ({count}) <ChevronDown className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}

        {comments?.length === 0 && (
          <div className="text-center py-12 bg-gray-50/50 rounded-[32px] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-serif italic">Поки що немає відгуків. Будьте першим!</p>
          </div>
        )}
      </div>
    </section>
  );
}
