// app/admin/posts/[id]/edit/page.tsx

import AuthGuard from "@/components/AuthGuard";
import PostEditor from "@/components/PostEditor";

interface EditPostPageProps {
  params: {
    id: string; // The dynamic part of the URL, which is the postId
  };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const postId = params.id;

  return (
    <AuthGuard requiredRole="admin">
      {/* Pass the postId to the PostEditor component */}
      <PostEditor postId={postId} />
    </AuthGuard>
  );
}
