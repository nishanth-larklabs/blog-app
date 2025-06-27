// components/AdminDashboardContent.tsx

"use client"; // This component will be used inside a client component (page.tsx via AuthGuard)

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboardContent() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10">
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

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/admin/posts/new"
              className="group block p-6 bg-slate-50 rounded-lg border-t-4 border-indigo-500 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out"
            >
              <h2 className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600">
                Create New Post
              </h2>
              <p className="mt-1 text-slate-500 text-sm">
                Start writing a fresh blog post.
              </p>
            </Link>
            <Link
              href="/admin/posts"
              className="group block p-6 bg-slate-50 rounded-lg border-t-4 border-sky-500 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out"
            >
              <h2 className="text-lg font-semibold text-slate-800 group-hover:text-sky-600">
                Manage Posts
              </h2>
              <p className="mt-1 text-slate-500 text-sm">
                Edit, publish, or delete existing posts.
              </p>
            </Link>
          </div>

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
  );
}
