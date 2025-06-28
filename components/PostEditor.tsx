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
    return (
      <div className="bg-slate-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl animate-pulse">
          <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10">
            <div className="h-8 bg-slate-200 rounded-md w-1/2 mx-auto mb-10"></div>
            <div className="space-y-8">
              <div>
                <div className="h-5 bg-slate-200 rounded-md w-20 mb-2"></div>
                <div className="h-10 bg-slate-200 rounded-md"></div>
              </div>
              <div>
                <div className="h-5 bg-slate-200 rounded-md w-24 mb-2"></div>
                <div className="h-64 bg-slate-200 rounded-md"></div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-6 w-12 bg-slate-200 rounded-full"></div>
                <div className="h-5 bg-slate-200 rounded-md w-32"></div>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <div className="h-10 w-24 bg-slate-200 rounded-md"></div>
                <div className="h-10 w-32 bg-slate-300 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-2 p-8">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-8">
                  {isEditing ? "Edit Post" : "Create New Post"}
                </h1>

                {error && (
                  <div className="rounded-md bg-red-50 p-4 mb-6" role="alert">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">
                          {error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-8">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium leading-6 text-slate-900"
                    >
                      Post Title
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        id="title"
                        className="block w-full rounded-md border-0 py-2.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="e.g., How to Build a Great UI"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="content"
                      className="block text-sm font-medium leading-6 text-slate-900"
                    >
                      Content
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="content"
                        rows={18}
                        className="block w-full rounded-md border-0 py-2.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-mono"
                        placeholder="Start writing your masterpiece..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1 bg-slate-50 p-8 lg:border-l lg:border-slate-200">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-semibold leading-6 text-slate-900">
                      Publishing
                    </h2>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start justify-between gap-x-4 rounded-lg border border-slate-200 bg-white p-4">
                        <div className="text-sm">
                          <label
                            htmlFor="published"
                            className="font-medium text-slate-900"
                          >
                            Publish Post
                          </label>
                          <p className="text-slate-500">
                            This post will be hidden from the public blog until
                            published.
                          </p>
                        </div>
                        <div className="flex items-center h-6">
                          <input
                            id="published"
                            type="checkbox"
                            className="peer sr-only"
                            checked={published}
                            onChange={(e) => setPublished(e.target.checked)}
                          />
                          <label
                            htmlFor="published"
                            className="relative flex h-6 w-11 cursor-pointer items-center rounded-full border border-transparent bg-slate-300 transition-colors duration-200 ease-in-out peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-600 peer-focus:ring-offset-2 peer-checked:bg-indigo-600 peer-checked:border-indigo-600"
                          >
                            <span
                              aria-hidden="true"
                              className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0 peer-checked:translate-x-5"
                            ></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-slate-200 pt-6">
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                      disabled={saving}
                    >
                      {saving
                        ? "Saving..."
                        : isEditing
                        ? "Update Post"
                        : "Create Post"}
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/admin/dashboard")}
                      className="flex w-full justify-center rounded-md bg-transparent px-3 py-2.5 text-sm font-semibold leading-6 text-slate-600 hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
