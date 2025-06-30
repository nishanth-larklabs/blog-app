import { db } from "@/lib/firebase";
import { Post } from "@/types/post";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon, ArrowRightIcon } from "@radix-ui/react-icons";

const formatDate = (date: Date | null) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const generateSummary = (content: string, wordLimit: number = 30) => {
  const words = content.split(" ");
  if (words.length <= wordLimit) {
    return content;
  }
  return words.slice(0, wordLimit).join(" ") + "...";
};

export default async function HomePage() {
  let publishedPosts: Post[] = [];
  let error: string | null = null;

  try {
    const postsRef = collection(db, "posts");
    const q = query(
      postsRef,
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    publishedPosts = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        authorId: data.authorId,
        authorName: data.authorName,
        published: data.published,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as Post;
    });
  } catch (e) {
    console.error("Error fetching documents: ", e);
    error = "Failed to load blog posts. Please try again later.";
  }

  return (
    <main className="bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <section className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Our Latest Insights
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Stay up to date with our latest articles, tutorials, and company
            news.
          </p>
        </section>

        {error && (
          <section className="mt-16">
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>An Error Occurred</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </section>
        )}

        <section className="mt-16">
          {publishedPosts.length === 0 && !error ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-10 w-10 text-primary"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold">No Posts Yet</h3>
              <p className="mt-2 text-muted-foreground">
                There are no blog posts available. Please check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {publishedPosts.map((post: Post) => (
                <Card
                  key={post.id}
                  className="group flex flex-col transition-all hover:shadow-lg"
                >
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                      <Link
                        href={`/posts/${post.id}`}
                        className="hover:text-primary focus-visible:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      By {post.authorName} on{" "}
                      {formatDate(post.createdAt.toDate())}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {generateSummary(post.content)}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link
                      href={`/posts/${post.id}`}
                      aria-label={`Read more about ${post.title}`}
                      className="inline-flex items-center text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                    >
                      Read More
                      <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
