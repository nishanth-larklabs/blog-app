"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { Post } from "@/types/post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";

interface PostEditorProps {
  postId?: string;
}

const PostEditorSkeleton = () => (
  <main className="container mx-auto max-w-5xl py-8 px-4">
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-72 w-full" />
          </div>
        </CardContent>
      </Card>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    </div>
  </main>
);

export default function PostEditor({ postId }: PostEditorProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!postId;

  useEffect(() => {
    if (!isEditing) {
      setLoading(false);
      return;
    }
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const postRef = doc(db, "posts", postId!);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          const data = postSnap.data() as Post;
          setTitle(data.title);
          setContent(data.content);
          setPublished(data.published);
        } else {
          setError("Post not found.");
          router.push("/admin/dashboard");
        }
      } catch (e) {
        console.error("Error fetching post for editing:", e);
        setError("Failed to load post for editing.");
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading && user && isEditing) {
      fetchPost();
    }
  }, [postId, isEditing, authLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    if (!user) {
      setError("You must be logged in to create/edit posts.");
      setSaving(false);
      return;
    }
    try {
      const postData = {
        title,
        content,
        published,
        updatedAt: Timestamp.now(),
      };
      if (isEditing) {
        const postRef = doc(db, "posts", postId!);
        await updateDoc(postRef, postData);
      } else {
        const newPostData = {
          ...postData,
          authorId: user.uid,
          authorName: user.displayName || user.email,
          createdAt: Timestamp.now(),
        };
        await addDoc(collection(db, "posts"), newPostData);
      }
      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Error saving post:", err);
      setError("Failed to save post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || (isEditing && loading)) {
    return <PostEditorSkeleton />;
  }

  return (
    <main className="container mx-auto max-w-5xl py-8 px-4">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  {isEditing ? "Edit Post" : "Create New Post"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <AlertTitle>An Error Occurred</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="title">Post Title</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="e.g., How to Build a Great UI"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={saving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content (Markdown supported)</Label>
                  <Textarea
                    id="content"
                    placeholder="Start writing your masterpiece..."
                    rows={18}
                    className="font-mono text-sm"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    disabled={saving}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label htmlFor="published" className="font-medium">
                      Publish Post
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Visible on the public blog.
                    </p>
                  </div>
                  <Switch
                    id="published"
                    checked={published}
                    onCheckedChange={setPublished}
                    disabled={saving}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing ? "Update Post" : "Create Post"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/admin/dashboard")}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </main>
  );
}
