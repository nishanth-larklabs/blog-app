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

  // Find the post from mock data
  const post = MOCK_POSTS.find(p => p.id === postId && p.published);

  // If post not found or not published, show a 404
  if (!post) {
    notFound(); // Next.js utility to render the default 404 page
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>
        <p className="text-md text-gray-600 dark:text-gray-400 mb-6">
          By {post.authorName} on {formatDate(post.createdAt)}{' '}
          {post.updatedAt && post.createdAt.getTime() !== post.updatedAt.getTime() && (
            <span className="text-sm italic"> (Last updated: {formatDate(post.updatedAt)})</span>
          )}
        </p>

        <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed space-y-4">
          {/* This is where the full content goes. We are just displaying it as plain text for now. */}
          {/* In a real app, this would be rendered from a rich text editor or markdown parser. */}
          <p>{post.content}</p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <svg className="mr-2 -ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path></svg>
            Back to Blog
          </a>
        </div>
      </article>
    </div>
  );
}