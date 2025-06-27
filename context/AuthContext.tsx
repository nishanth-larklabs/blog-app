// context/AuthContext.tsx

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db } from '@/lib/firebase';
import { User as FirebaseUser } from 'firebase/auth'; // Alias for Firebase Auth User type
import { doc, getDoc } from 'firebase/firestore';
import { AppUser } from '@/types/user';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in from Firebase Auth
        // Now, fetch custom user data (like role) from Firestore
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const firestoreUserData = userDocSnap.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firestoreUserData.displayName || firebaseUser.displayName,
              role: firestoreUserData.role || 'user', // Default to 'user' if not specified
            });
          } else {
            // User document does not exist in Firestore for this UID
            // This might happen for new users, or users who haven't had their role set yet.
            // For now, treat them as a regular user without a specific role from Firestore.
            console.warn(`User document not found for UID: ${firebaseUser.uid}. Defaulting to 'user' role.`);
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              role: 'user', // Default role if Firestore document is missing
            });
            // In a real application, you might want to create this user document here
            // if it's the first time they're logging in (for non-admin users).
          }
        } catch (firestoreError) {
          console.error("Error fetching user role from Firestore:", firestoreError);
          // Fallback to basic Firebase user if Firestore fetch fails
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role: 'user', // Assume 'user' role on error
          });
        }
      } else {
        // No user is signed in
        setUser(null);
      }
      setLoading(false); // Authentication state checked, stop loading
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array means this runs once on mount

  const logout = async () => {
    await auth.signOut();
    // onAuthStateChanged listener will automatically update the user state to null
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};