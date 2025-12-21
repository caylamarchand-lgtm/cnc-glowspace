// lib/glowcodes.ts
import { supabase } from "./supabaseClient";

export type GlowCode = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  css: string;
  tags: any | null;
  created_at: string;
  updated_at: string;
};

// Get current user's glowcodes
export async function getMyGlowcodes() {
  const { data, error } = await supabase
    .from("glowcodes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as GlowCode[];
}

// Create a new glowcode
export async function createGlowcode(input: {
  title: string;
  description?: string;
  css: string;
  tags?: string[];
}) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("glowcodes")
    .insert([
      {
        user_id: auth.user.id,
        title: input.title,
        description: input.description ?? null,
        css: input.css,
        tags: input.tags ?? null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as GlowCode;
}

// Update an existing glowcode
export async function updateGlowcode(
  id: string,
  patch: Partial<Pick<GlowCode, "title" | "description" | "css" | "tags">>
) {
  const { data, error } = await supabase
    .from("glowcodes")
    .update({
      ...patch,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as GlowCode;
}

// Delete a glowcode
export async function deleteGlowcode(id: string) {
  const { error } = await supabase
    .from("glowcodes")
    .delete()
    .eq("id", id);

  if (error) throw error;
}