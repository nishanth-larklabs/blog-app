import { db } from "@/lib/firebase";
import { Post } from "@/types/post";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

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
    <main className="bg-background py-16 sm:py-24">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Button asChild variant="ghost" className="pl-0">
            <Link href="/" className="inline-flex items-center gap-2">
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
        <article>
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <div className="mt-6 flex items-center justify-center gap-x-4 text-sm text-muted-foreground">
              <p>By {post.authorName}</p>
              <span aria-hidden="true">·</span>
              <time dateTime={post.createdAt.toDate().toISOString()}>
                {formatDate(post.createdAt.toDate())}
              </time>
            </div>
            {post.updatedAt &&
              post.createdAt.toMillis() !== post.updatedAt.toMillis() && (
                <p className="mt-2 text-xs italic text-muted-foreground">
                  (Last updated: {formatDate(post.updatedAt.toDate())})
                </p>
              )}
          </header>

          <div className="prose prose-lg dark:prose-invert lg:prose-xl mx-auto max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </main>
  );
}
