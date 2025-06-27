// app/posts/[id]/page.tsx

import { MOCK_POSTS } from '@/lib/mockPosts';
import { Post } from '@/types/post';
import { notFound } from 'next/navigation'; // For handling post not found

// Helper function to format dates (can be moved to a shared utility later)
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Define the type for the component's props, specifically the params for dynamic routes
interface PostDetailPageProps {
  params: {
    id: string; // The dynamic part of the URL, e.g., '1', '2'
  };
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const postId = params.id;
  const post = MOCK_POSTS.find(p => p.id === postId && p.published);

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
          By {post.authorName} on {formatDate(post.createdAt)}{' '}
          {post.updatedAt && post.createdAt.getTime() !== post.updatedAt.getTime() && (
            <span className="text-sm italic"> (Last updated: {formatDate(post.updatedAt)})</span>
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
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
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