// components/AdminDashboardContent.tsx

"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react"; // Import useCallback
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore"; // Import doc, updateDoc, deleteDoc
import { Post } from "@/types/post";

// Helper function to format dates
const formatDate = (date: Date | null) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short", // e.g., Jun
    day: "numeric",
  });
};

export default function AdminDashboardContent() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized function to fetch posts
  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    setError(null);
    try {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const fetchedPosts: Post[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          content: data.content,
          authorId: data.authorId,
          authorName: data.authorName,
          published: data.published,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        } as Post;
      });
      setPosts(fetchedPosts);
    } catch (e) {
      console.error("Error fetching admin posts: ", e);
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoadingPosts(false);
    }
  }, []); // No dependencies for useCallback, as it's a pure fetch operation

  useEffect(() => {
    // Only fetch posts if user is authenticated (AuthGuard already ensures admin role)
    if (user) {
      fetchPosts();
    }
  }, [user, fetchPosts]); // Re-run if user changes or fetchPosts function reference changes (it won't, due to useCallback)

  const handleTogglePublish = async (
    postId: string,
    currentStatus: boolean
  ) => {
    try {
      setLoadingPosts(true); // Indicate that an operation is in progress
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        published: !currentStatus,
        updatedAt: new Date(), // Update the timestamp
      });
      console.log(
        `Post ${postId} published status toggled to ${!currentStatus}`
      );
      await fetchPosts(); // Re-fetch posts to update the list
    } catch (e) {
      console.error("Error toggling publish status:", e);
      setError("Failed to update post status.");
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleDeletePost = async (postId: string, postTitle: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete the post "${postTitle}"? This action cannot be undone.`
      )
    ) {
      try {
        setLoadingPosts(true); // Indicate that an operation is in progress
        const postRef = doc(db, "posts", postId);
        await deleteDoc(postRef);
        console.log(`Post ${postId} deleted successfully.`);
        await fetchPosts(); // Re-fetch posts to update the list
      } catch (e) {
        console.error("Error deleting post:", e);
        setError("Failed to delete post.");
      } finally {
        setLoadingPosts(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Admin Dashboard
        </h1>
        {user && (
          <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
            Welcome,{" "}
            <span className="font-semibold">
              {user.displayName || user.email}
            </span>
            ! (Role: {user.role})
          </p>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            All Blog Posts
          </h2>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="mr-2 -ml-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            New Post
          </Link>
        </div>

        {loadingPosts && posts.length === 0 ? ( // Show full loading spinner only if no posts are loaded yet
          <div className="text-center py-8">
            <svg
              className="animate-spin h-8 w-8 text-blue-500 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Loading posts...
            </p>
          </div>
        ) : error ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 py-8">
            No posts found. Start by creating a new one!
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Author
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Published
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className={loadingPosts ? "opacity-70 animate-pulse" : ""}
                  >
                    {" "}
                    {/* Add subtle loading feedback per row */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {post.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {post.authorName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.published ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          Yes
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(post.createdAt.toDate())}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() =>
                          handleTogglePublish(post.id, post.published)
                        }
                        className={`text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4 ${
                          post.published ? "font-semibold" : ""
                        }`}
                        disabled={loadingPosts} // Disable buttons during operations
                      >
                        {post.published ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id, post.title)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        disabled={loadingPosts} // Disable buttons during operations
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={logout}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
