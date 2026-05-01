import { MessageSquare } from "lucide-react";
import { CommentCard } from "@/components/admin/CommentCard";
import { adminService } from "@/lib/services/admin.service";
export default async function CommentsAdminPage() {
  const comments = await adminService.getAllComments();

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold font-serif">Модерація коментарів</h1>

      <div className="grid gap-4">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}

        {comments.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100 border-dashed">
            <MessageSquare className="mx-auto mb-4 text-gray-200" size={48} />
            <p className="text-gray-400">Коментарів поки немає</p>
          </div>
        )}
      </div>
    </div>
  );
}
