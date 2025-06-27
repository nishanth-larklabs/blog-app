// app/page.tsx

import { db } from '@/lib/firebase';
import { Post } from '@/types/post';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

// Helper function to format dates
const formatDate = (date: Date | null) => {
  if (!date) return 'N/A';
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

export default async function HomePage() {
  let publishedPosts: Post[] = [];
  let error: string | null = null;

  try {
    const postsRef = collection(db, 'posts');
    // Create a query to get only published posts, ordered by createdAt in descending order
    const q = query(postsRef, where('published', '==', true), orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);

    publishedPosts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        authorId: data.authorId,
        authorName: data.authorName,
        published: data.published,
        createdAt: data.createdAt, // Firestore Timestamp object
        updatedAt: data.updatedAt, // Firestore Timestamp object
      } as Post;
    });

  } catch (e) {
    console.error("Error fetching documents: ", e);
    error = "Failed to load blog posts. Please try again later.";
  }

  return (
  <div className="bg-slate-50">
    <div className="container mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Our Latest Blog Posts
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-500 sm:mt-4">
          Stay up to date with our latest insights, tutorials, and company news.
        </p>
      </div>

      {error && (
        <div className="mt-8 rounded-md bg-red-50 p-4" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">An Error Occurred</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-2">
        {publishedPosts.length === 0 && !error ? (
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
                <h2 className="text-xl font-semibold text-slate-900 transition-colors duration-300 ease-in-out group-hover:text-indigo-600">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  By {post.authorName} on {formatDate(post.createdAt.toDate())}
                </p>
                <p className="mt-4 text-base leading-relaxed text-slate-600 flex-grow">
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