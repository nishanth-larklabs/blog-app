"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Post } from "@/types/post";

const formatDate = (date: Date | null) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <header className="mb-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
              Admin Dashboard
            </h1>
            {user && (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <p className="text-lg text-slate-600 font-medium">
                  Welcome back,{" "}
                  <span className="text-slate-900 font-semibold">
                    {user.displayName || user.email}
                  </span>
                </p>
              </div>
            )}
          </div>
        </header>

        <main className="space-y-8">
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 sm:px-8 py-6 border-b border-slate-100 bg-slate-50/30">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">
                    Blog Posts
                  </h2>
                  <p className="text-sm text-slate-500">
                    Manage and organize your content
                  </p>
                </div>
                <Link
                  href="/admin/posts/new"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/25 focus:ring-offset-2"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create New Post
                </Link>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {loadingPosts ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-4 bg-slate-50 rounded-lg">
                    {["Title", "Author", "Status", "Date", "Actions"].map(
                      (header, i) => (
                        <div
                          key={i}
                          className="h-4 bg-slate-200 rounded animate-pulse"
                        ></div>
                      )
                    )}
                  </div>
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-4 border border-slate-100 rounded-lg"
                    >
                      <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse"></div>
                      <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                      <div className="flex space-x-2">
                        <div className="h-4 w-12 bg-slate-200 rounded animate-pulse"></div>
                        <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
                        <div className="h-4 w-12 bg-slate-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div
                  className="bg-red-50 border border-red-200 rounded-xl p-6"
                  role="alert"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-red-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-900 mb-1">
                        Something went wrong
                      </h3>
                      <p className="text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-10 h-10 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      No posts yet
                    </h3>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                      Start creating engaging content for your audience. Your
                      first blog post is just a click away.
                    </p>
                    <Link
                      href="/admin/posts/new"
                      className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/25 focus:ring-offset-2"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Create Your First Post
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <div className="hidden sm:block">
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-4 px-2 text-sm font-semibold text-slate-900 uppercase tracking-wide">
                              Title
                            </th>
                            <th className="text-left py-4 px-2 text-sm font-semibold text-slate-900 uppercase tracking-wide">
                              Author
                            </th>
                            <th className="text-left py-4 px-2 text-sm font-semibold text-slate-900 uppercase tracking-wide">
                              Status
                            </th>
                            <th className="text-left py-4 px-2 text-sm font-semibold text-slate-900 uppercase tracking-wide">
                              Date
                            </th>
                            <th className="text-right py-4 px-2 text-sm font-semibold text-slate-900 uppercase tracking-wide">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {posts.map((post) => (
                            <tr
                              key={post.id}
                              className="hover:bg-slate-50/50 transition-colors duration-150"
                            >
                              <td className="py-4 px-2">
                                <div className="font-semibold text-slate-900 text-base leading-tight">
                                  {post.title}
                                </div>
                              </td>
                              <td className="py-4 px-2 text-slate-600 font-medium">
                                {post.authorName}
                              </td>
                              <td className="py-4 px-2">
                                {post.published ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></div>
                                    Published
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1.5"></div>
                                    Draft
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-2 text-slate-600 font-medium">
                                {formatDate(post.createdAt.toDate())}
                              </td>
                              <td className="py-4 px-2">
                                <div className="flex items-center justify-end space-x-3">
                                  <Link
                                    href={`/admin/posts/${post.id}/edit`}
                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
                                  >
                                    Edit
                                  </Link>
                                  <button
                                    onClick={() =>
                                      console.log(
                                        "Toggle publish for:",
                                        post.id
                                      )
                                    }
                                    className="text-slate-600 hover:text-slate-800 font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-slate-500/25"
                                  >
                                    {post.published ? "Unpublish" : "Publish"}
                                  </button>
                                  <button
                                    onClick={() =>
                                      console.log("Delete for:", post.id)
                                    }
                                    className="text-red-600 hover:text-red-800 font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500/25"
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
                  </div>

                  <div className="sm:hidden space-y-4">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-slate-900 text-lg leading-tight flex-1 mr-4">
                            {post.title}
                          </h3>
                          {post.published ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 flex-shrink-0">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></div>
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200 flex-shrink-0">
                              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1.5"></div>
                              Draft
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <span className="font-medium">{post.authorName}</span>
                          <span>•</span>
                          <span>{formatDate(post.createdAt.toDate())}</span>
                        </div>
                        <div className="flex items-center space-x-4 pt-2">
                          <Link
                            href={`/admin/posts/${post.id}/edit`}
                            className="flex-1 text-center py-2.5 px-4 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() =>
                              console.log("Toggle publish for:", post.id)
                            }
                            className="flex-1 text-center py-2.5 px-4 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-slate-500/25"
                          >
                            {post.published ? "Unpublish" : "Publish"}
                          </button>
                          <button
                            onClick={() => console.log("Delete for:", post.id)}
                            className="py-2.5 px-4 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500/25"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <div className="text-center pt-8">
            <button
              onClick={logout}
              className="inline-flex items-center px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl bg-white hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-500/25 focus:ring-offset-2 shadow-sm hover:shadow-md"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
