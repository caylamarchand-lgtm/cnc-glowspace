"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "../lib/supabaseClient";

type Post = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
 profiles?: {
  display_name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
} | null;
};

type PostsContextValue = {
  posts: Post[];
  addPost: (title: string, content: string) => Promise<void>;
  clearPosts: () => void;
  refreshPosts: () => Promise<void>;
};

const PostsContext = createContext<PostsContextValue | null>(null);

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error("usePosts must be used within PostsProvider");
  return ctx;
}

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);

  const refreshPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        id,
        content,
        created_at,
        user_id,
        profiles (
          display_name,
          username,
          avatar_url
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading posts:", error.message);
      return;
    }

    setPosts((data ?? []) as Post[]);
  };

  useEffect(() => {
    refreshPosts();
  }, []);

  const value = useMemo(() => {
    return {
      posts,

      addPost: async (_title: string, content: string) => {
        const trimmed = content.trim();
        if (!trimmed) return;

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) return;

        const { data, error } = await supabase
          .from("posts")
          .insert({
            user_id: user.id,
            content: trimmed,
          })
          .select(
            `
            id,
            content,
            created_at,
            user_id,
            profiles (
              display_name,
              username,
              avatar_url
            )
          `
          )
          .single();

        if (error) {
          console.error("Error creating post:", error.message);
          return;
        }

        if (data) setPosts((prev) => [data as Post, ...prev]);
      },

      clearPosts: () => setPosts([]),

      refreshPosts,
    };
  }, [posts]);

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}