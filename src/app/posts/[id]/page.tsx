// app/posts/[id]/page.tsx

import { db } from "@/lib/firebase";
import { Post } from "@/types/post";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Helper function to format dates
const formatDate = (date: Date | null) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

interface PostDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  // Await the params before using them
  const { id: postId } = await params;
  let post: Post | undefined;

  try {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists() && postSnap.data().published) {
      const data = postSnap.data();
      post = {
        id: postSnap.id,
        title: data.title,
        content: data.content,
        authorId: data.authorId,
        authorName: data.authorName,
        published: data.published,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as Post;
    } else {
      notFound();
    }
  } catch (e) {
    console.error("Error fetching document: ", e);
    notFound();
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-slate-50 px-4 py-16 sm:py-24">
      <article className="mx-auto max-w-4xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12">
        <h1 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl mb-4">
          {post.title}
        </h1>
        <p className="text-center text-md text-slate-500 mb-10">
          By {post.authorName} on {formatDate(post.createdAt.toDate())}{" "}
          {post.updatedAt &&
            post.createdAt.toMillis() !== post.updatedAt.toMillis() && (
              <span className="text-sm italic">
                (Last updated: {formatDate(post.updatedAt.toDate())})
              </span>
            )}
        </p>

        <div className="prose prose-lg lg:prose-xl prose-slate max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        <div className="mt-12 pt-10 border-t border-slate-200">
          <a
            href="/"
            className="inline-flex items-center gap-x-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-8 focus-visible:ring-indigo-500 rounded-sm"
          >
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              ></path>
            </svg>
            Back to Blog
          </a>
        </div>
      </article>
    </div>
  );
}
