// app/login/page.tsx

'use client'; // This component uses client-side hooks like useState and useRouter

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setLoading(true); // Set loading state

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // On successful login, redirect to a protected route (e.g., admin dashboard)
      // We'll create the dashboard in a later step, for now, redirect to home.
      router.push('/admin/dashboard'); // Anticipate the admin dashboard route
    } catch (err: any) {
      console.error("Login error:", err);
      let errorMessage = "Failed to log in. Please check your credentials.";
      if (err.code === 'auth/user-not-found') {
        errorMessage = "No user found with this email.";
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password.";
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = "Invalid email format.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
  <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md">
    <h1 className="text-2xl font-bold text-center text-slate-900 sm:text-3xl mb-8">
      Admin Login
    </h1>

    {error && (
      <div className="flex items-start bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6" role="alert">
        <svg className="w-5 h-5 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
        </svg>
        <span className="text-sm">{error}</span>
      </div>
    )}

    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors duration-200"
        disabled={loading}
      >
        {loading ? 'Logging In...' : 'Login'}
      </button>
    </form>
  </div>
</div>
  );
}