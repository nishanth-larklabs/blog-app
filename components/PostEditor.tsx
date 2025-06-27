// components/PostEditor.tsx

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

interface PostEditorProps {
  postId?: string; // Optional: if provided, we are editing an existing post
}

export default function PostEditor({ postId }: PostEditorProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true); // For loading existing post data
  const [saving, setSaving] = useState(false); // For form submission
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!postId;

  // Effect to load post data if in editing mode
  useEffect(() => {
    if (!isEditing) {
      setLoading(false); // No post to load if creating
      return;
    }

    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const postRef = doc(db, "posts", postId!);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          const data = postSnap.data() as Post; // Cast to Post for type safety
          setTitle(data.title);
          setContent(data.content);
          setPublished(data.published);
        } else {
          setError("Post not found.");
          // Optionally redirect to a 404 or admin posts list
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
      // Ensure user is loaded before fetching post
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
        updatedAt: Timestamp.now(), // Always update timestamp on save
      };

      if (isEditing) {
        // Update existing post
        const postRef = doc(db, "posts", postId!);
        await updateDoc(postRef, postData);
        console.log("Post updated successfully!");
      } else {
        // Create new post
        const newPostData = {
          ...postData,
          authorId: user.uid,
          authorName: user.displayName || user.email,
          createdAt: Timestamp.now(),
        };
        await addDoc(collection(db, "posts"), newPostData);
        console.log("New post created successfully!");
      }

      // Redirect to admin dashboard after successful save
      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Error saving post:", err);
      setError("Failed to save post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || (isEditing && loading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Loading editor...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          {isEditing ? "Edit Post" : "Create New Post"}
        </h1>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Content
            </label>
            <textarea
              id="content"
              rows={15}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
              placeholder="Write your blog post content here (supports Markdown, will render as plain text for now)..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="flex items-center">
            <input
              id="published"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <label
              htmlFor="published"
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
            >
              Publish Post
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push("/admin/dashboard")}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
            >
              {saving ? "Saving..." : isEditing ? "Update Post" : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
