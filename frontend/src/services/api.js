import { supabase } from "../lib/supabase";
import { getUserId } from "../lib/user";

export async function fetchImages() {
  const userId = getUserId();

  const { data, error } = await supabase
    .from("images")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function importImages(folderUrl, userId) {
  const response = await fetch(
    import.meta.env.VITE_IMPORT_API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        folder_url: folderUrl,
        user_id: userId,
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Import failed");
  }

  return response.json();
}