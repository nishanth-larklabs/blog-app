// app/posts/[id]/page.tsx

import { db } from '@/lib/firebase';
import { Post } from '@/types/post';
import { doc, getDoc } from 'firebase/firestore'; // Import doc and getDoc
import { notFound } from 'next/navigation';

// Helper function to format dates (can be moved to a shared utility later)
const formatDate = (date: Date | null) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

interface PostDetailPageProps {
  params: {
    id: string;
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const postId = params.id;
  let post: Post | undefined;

  try {
    const postRef = doc(db, 'posts', postId); // Get a reference to the specific document
    const postSnap = await getDoc(postRef); // Fetch the document

    if (postSnap.exists() && postSnap.data().published) {
      // Ensure the post exists and is published
      const data = postSnap.data();
      post = {
        id: postSnap.id,
        title: data.title,
        content: data.content,
        authorId: data.authorId,
        authorName: data.authorName,
        published: data.published,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as Post;
    } else {
      notFound(); // If not found or not published, show 404
    }
  } catch (e) {
    console.error("Error fetching document: ", e);
    notFound(); // Treat any error during fetch as not found for a public page
  }

  // This check is technically redundant due to notFound() in the try/catch,
  // but good for explicit type narrowing for the return block.
  if (!post) {
    notFound();
  }

  return (
<div className="bg-slate-50 px-4 py-16 sm:py-24">
  <article className="mx-auto max-w-4xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12">
    <h1 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl mb-4">
      {post.title}
    </h1>
    <p className="text-center text-md text-slate-500 mb-10">
      By {post.authorName} on {formatDate(post.createdAt.toDate())}{' '}
      {post.updatedAt && post.createdAt.toMillis() !== post.updatedAt.toMillis() && (
        <span className="text-sm italic"> (Last updated: {formatDate(post.updatedAt.toDate())})</span>
      )}
    </p>

    <div className="prose prose-lg lg:prose-xl prose-slate max-w-none">
      <p>{post.content}</p>
    </div>

    <div className="mt-12 pt-10 border-t border-slate-200">
      <a
        href="/"
        className="inline-flex items-center gap-x-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-8 focus-visible:ring-indigo-500 rounded-sm"
      >
        <svg
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Blog
      </a>
    </div>
  </article>
</div>
  );
}