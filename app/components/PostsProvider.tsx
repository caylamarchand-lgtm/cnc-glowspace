"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

type PostsContextValue = {
  posts: Post[];
  addPost: (title: string, content: string) => void;
  clearPosts: () => void;
};

const PostsContext = createContext<PostsContextValue | null>(null);

const STORAGE_KEY = "glowspace_posts_v1";

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);

  // Load posts once
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setPosts(JSON.parse(raw));
  }, []);

  // Save posts whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const value = useMemo(() => {
    return {
      posts,
      addPost: (title: string, content: string) => {
        setPosts((prev) => [
          {
            id: crypto.randomUUID(),
            title: title.trim(),
            content: content.trim(),
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      },
      clearPosts: () => setPosts([]),
    };
  }, [posts]);

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) {
    throw new Error("usePosts must be used inside PostsProvider");
  }
  return ctx;
}