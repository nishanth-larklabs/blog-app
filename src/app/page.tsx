// app/page.tsx

import { MOCK_POSTS } from '@/lib/mockPosts';
import { Post } from '@/types/post';

// Helper function to format dates
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Helper function to generate a summary
const generateSummary = (content: string, wordLimit: number = 30) => {
  const words = content.split(' ');
  if (words.length <= wordLimit) {
    return content;
  }
  return words.slice(0, wordLimit).join(' ') + '...';
};

export default function HomePage() {
  // Filter for published posts and sort by newest first
  const publishedPosts = MOCK_POSTS
    .filter(post => post.published)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-900 dark:text-gray-100">
        Our Latest Blog Posts
      </h1>

      <div className="grid gap-8">
        {publishedPosts.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No blog posts available yet. Check back soon!
          </p>
        ) : (
          publishedPosts.map((post: Post) => (
            <article
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  By {post.authorName} on {formatDate(post.createdAt)}
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {generateSummary(post.content)}
                </p>
                <a
                  href={`/posts/${post.id}`} // We'll implement this route later
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Read More
                  <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </a>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}