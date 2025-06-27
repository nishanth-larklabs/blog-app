// lib/mockPosts.ts

import { Post } from '@/types/post';

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js',
    content: 'Next.js is a powerful React framework for building full-stack web applications. It enables features like server-side rendering and static site generation out of the box. This post covers the basics of setting up your first Next.js project and understanding its core concepts. From routing to data fetching, Next.js provides a streamlined developer experience.',
    authorId: 'auth001',
    authorName: 'Alice Johnson',
    published: true,
    createdAt: new Date('2025-06-25T10:00:00Z'),
    updatedAt: new Date('2025-06-25T10:00:00Z'),
  },
  {
    id: '2',
    title: 'Understanding React Query for Data Fetching',
    content: 'React Query (now TanStack Query) simplifies data fetching, caching, and state management in React applications. It handles complex tasks like stale-while-revalidate, automatic refetching, and error handling, making your data layer robust and efficient. This article delves into `useQuery` and `useMutation` hooks, demonstrating how they can drastically improve your app\'s performance and user experience.',
    authorId: 'auth002',
    authorName: 'Bob Williams',
    published: true,
    createdAt: new Date('2025-06-20T14:30:00Z'),
    updatedAt: new Date('2025-06-20T14:30:00Z'),
  },
  {
    id: '3',
    title: 'Styling with Tailwind CSS: A Practical Guide',
    content: 'Tailwind CSS is a utility-first CSS framework that allows you to build custom designs directly in your markup. Unlike traditional CSS frameworks, Tailwind provides low-level utility classes that you can combine to create unique components. Learn how to set up Tailwind in your project, understand its core concepts, and build responsive layouts with ease. This guide covers everything from responsive design to custom configurations.',
    authorId: 'auth001',
    authorName: 'Alice Johnson',
    published: true,
    createdAt: new Date('2025-06-15T09:15:00Z'),
    updatedAt: new Date('2025-06-15T09:15:00Z'),
  },
  {
    id: '4',
    title: 'Future of Web Development',
    content: 'The web development landscape is constantly evolving. From new frameworks to advanced browser APIs, staying updated is crucial. This post explores emerging trends like WebAssembly, serverless functions, and AI-powered development tools, offering insights into what the future might hold for developers. We also touch upon the importance of performance optimization and security in modern web applications.',
    authorId: 'auth003',
    authorName: 'Charlie Brown',
    published: false, // This post is unpublished
    createdAt: new Date('2025-06-10T11:00:00Z'),
    updatedAt: new Date('2025-06-10T11:00:00Z'),
  },
];