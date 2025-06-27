// types/user.ts

export type UserRole = 'admin' | 'user'; // Define possible roles

export type AppUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole; // Our custom role
};

// This type represents the data stored in Firestore for a user
export type FirestoreUser = {
  email: string | null;
  displayName: string | null;
  role: UserRole;
};