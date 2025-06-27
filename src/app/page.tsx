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
    <div className="bg-slate-50">
  <div className="container mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
    <div className="text-center">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        From the Blog
      </h1>
      <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-500 sm:mt-4">
        Stay up to date with our latest insights, tutorials, and company news.
      </p>
    </div>

    <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-2">
      {publishedPosts.length === 0 ? (
        <div className="lg:col-span-2 text-center py-24 px-6 bg-white rounded-2xl">
          <h3 className="text-xl font-semibold text-slate-800">
            No Posts Yet
          </h3>
          <p className="mt-2 text-slate-500">
            There are no blog posts available at the moment. Please check back soon!
          </p>
        </div>
      ) : (
        publishedPosts.map((post: Post) => (
          <article
            key={post.id}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 ease-in-out hover:shadow-xl"
          >
            <div className="flex flex-col flex-grow p-6 sm:p-8">
              <div className="flex text-sm text-slate-500">
                <p>By {post.authorName}</p>
                <span aria-hidden="true" className="mx-2">·</span>
                <time dateTime={post.createdAt.toISOString()}>{formatDate(post.createdAt)}</time>
              </div>
              <h2 className="mt-2 text-xl font-semibold text-slate-900 transition-colors duration-300 ease-in-out group-hover:text-indigo-600">
                {post.title}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-slate-600 flex-grow">
                {generateSummary(post.content)}
              </p>
              <div className="mt-6">
                <a
                  href={`/posts/${post.id}`}
                  className="inline-flex items-center text-sm font-semibold text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 rounded-sm"
                  aria-label={`Read more about ${post.title}`}
                >
                  Read More
                  <svg
                    className="ml-1 h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  </div>
    </div>
  );
}