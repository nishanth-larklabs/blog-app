// components/AdminDashboardContent.tsx

'use client'; // This component will be used inside a client component (page.tsx via AuthGuard)

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboardContent() {
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Admin Dashboard
        </h1>
        {user && (
          <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
            Welcome, <span className="font-semibold">{user.displayName || user.email}</span>! (Role: {user.role})
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/admin/posts/new" className="block p-6 bg-blue-100 dark:bg-blue-900 rounded-lg shadow hover:shadow-md transition-shadow duration-300 text-center">
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">Create New Post</h2>
            <p className="text-blue-700 dark:text-blue-300 text-sm">Start writing a fresh blog post.</p>
          </Link>
          <Link href="/admin/posts" className="block p-6 bg-green-100 dark:bg-green-900 rounded-lg shadow hover:shadow-md transition-shadow duration-300 text-center">
            <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">Manage Posts</h2>
            <p className="text-green-700 dark:text-green-300 text-sm">Edit, publish, or delete existing posts.</p>
          </Link>
        </div>

        <div className="text-center">
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