// components/AdminDashboardContent.tsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
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

  useEffect(() => {
    const fetchPosts = async () => {
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
    };

    if (user) {
      fetchPosts();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Admin Dashboard
            </h1>
            {user && (
              <p className="mt-3 text-slate-500">
                Welcome,{" "}
                <span className="font-semibold text-slate-600">
                  {user.displayName || user.email}
                </span>
              </p>
            )}
          </div>

          <div className="mt-10 border-b border-slate-200 pb-5 sm:flex sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold leading-6 text-slate-900">
              All Blog Posts
            </h2>
            <div className="mt-3 sm:ml-4 sm:mt-0">
              <Link
                href="/admin/posts/new"
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <svg
                  className="-ml-0.5 mr-1.5 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
                New Post
              </Link>
            </div>
          </div>

          <div className="mt-8 flow-root">
            {loadingPosts ? (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <div className="min-w-full animate-pulse">
                  <div className="bg-slate-50">
                    <div className="flex">
                      <div className="w-1/3 px-6 py-4">
                        <div className="h-4 bg-slate-200 rounded"></div>
                      </div>
                      <div className="w-1/6 px-6 py-4">
                        <div className="h-4 bg-slate-200 rounded"></div>
                      </div>
                      <div className="w-1/6 px-6 py-4">
                        <div className="h-4 bg-slate-200 rounded"></div>
                      </div>
                      <div className="w-1/6 px-6 py-4">
                        <div className="h-4 bg-slate-200 rounded"></div>
                      </div>
                      <div className="w-1/6 px-6 py-4">
                        <div className="h-4 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white divide-y divide-slate-200">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex">
                        <div className="w-1/3 px-6 py-5">
                          <div className="h-4 bg-slate-200 rounded"></div>
                        </div>
                        <div className="w-1/6 px-6 py-5">
                          <div className="h-4 bg-slate-200 rounded"></div>
                        </div>
                        <div className="w-1/6 px-6 py-5">
                          <div className="h-4 w-10 bg-slate-200 rounded-full"></div>
                        </div>
                        <div className="w-1/6 px-6 py-5">
                          <div className="h-4 bg-slate-200 rounded"></div>
                        </div>
                        <div className="w-1/6 px-6 py-5">
                          <div className="h-4 w-24 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="rounded-md bg-red-50 p-4" role="alert">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      An Error Occurred
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-lg">
                <svg
                  className="mx-auto h-12 w-12 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">
                  No posts found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Get started by creating a new blog post.
                </p>
                <div className="mt-6">
                  <Link
                    href="/admin/posts/new"
                    className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <svg
                      className="-ml-0.5 mr-1.5 h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                    New Post
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                      >
                        Author
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {posts.map((post) => (
                      <tr
                        key={post.id}
                        className="hover:bg-slate-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          {post.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {post.authorName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {post.published ? (
                            <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {formatDate(post.createdAt.toDate())}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end items-center gap-x-4">
                            <Link
                              href={`/admin/posts/${post.id}/edit`}
                              className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 rounded-sm"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() =>
                                console.log("Toggle publish for:", post.id)
                              }
                              className="text-slate-600 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 rounded-sm"
                            >
                              {post.published ? "Unpublish" : "Publish"}
                            </button>
                            <button
                              onClick={() =>
                                console.log("Delete for:", post.id)
                              }
                              className="text-red-600 hover:text-red-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 rounded-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-12 text-center">
              <button
                onClick={logout}
                className="inline-flex items-center px-5 py-2.5 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-red-50 hover:border-red-400 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
