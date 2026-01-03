export async function importImages(folderUrl) {
  const response = await fetch(
    ${import.meta.env.VITE_IMPORT_API_URL},
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ folder_url: folderUrl }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Import failed (${response.status}): ${JSON.stringify(data)}`
    );
  }

  return data;
}