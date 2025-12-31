const API_BASE_URL = "http://localhost:8000";

export async function fetchImages() {
  console.log("Fetching from:", `${API_BASE_URL}/images`);

  const response = await fetch(`${API_BASE_URL}/images`);

  const text = await response.text();
  console.log("Raw response:", text);

  return JSON.parse(text);
}