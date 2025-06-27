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
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-900 dark:text-gray-100">
        Our Latest Blog Posts
      </h1>

      {error && (
        <p className="text-center text-red-600 dark:text-red-400 mb-4">{error}</p>
      )}

      <div className="grid gap-8">
        {publishedPosts.length === 0 && !error ? (
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
                  By {post.authorName} on {formatDate(post.createdAt.toDate())}
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {generateSummary(post.content)}
                </p>
                <a
                  href={`/posts/${post.id}`}
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