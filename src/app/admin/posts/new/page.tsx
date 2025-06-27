// app/admin/posts/new/page.tsx

import AuthGuard from "@/components/AuthGuard";
import PostEditor from "@/components/PostEditor";

export default function CreateNewPostPage() {
  return (
    <AuthGuard requiredRole="admin">
      {/* PostEditor will handle both creation and editing. */}
      {/* For creation, we pass no 'postId' prop. */}
      <PostEditor />
    </AuthGuard>
  );
}
