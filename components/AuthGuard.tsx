// components/AuthGuard.tsx

"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/user";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: UserRole; // Optional: specify a required role
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Not authenticated, redirect to login
        router.push("/login");
      } else if (requiredRole === "admin" && !isAdmin) {
        // Authenticated but not an admin, redirect to home or unauthorized page
        // We redirect to login to keep things simple for now, but in a real app,
        // you might want a dedicated "Unauthorized" page.
        router.push("/login?unauthorized=true");
      }
    }
  }, [loading, isAuthenticated, isAdmin, requiredRole, router]); // Re-run effect if these change

  // While loading, or if authentication check is ongoing, show a loading indicator
  if (loading || !isAuthenticated || (requiredRole === "admin" && !isAdmin)) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-slate-100"
        role="status"
        aria-live="polite"
      >
        <p className="text-xl font-medium text-slate-600 animate-pulse">
          Loading or redirecting...
        </p>
      </div>
    );
  }

  // If authenticated and authorized, render children
  return <>{children}</>;
}
