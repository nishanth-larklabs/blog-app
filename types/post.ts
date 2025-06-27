// types/post.ts

import { Timestamp } from 'firebase/firestore'; // Import Timestamp type

export type Post = {
  id: string; // Document ID from Firestore
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  published: boolean;
  createdAt: Timestamp; // Change to Timestamp
  updatedAt: Timestamp; // Change to Timestamp
};