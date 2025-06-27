// types/post.ts

export type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};