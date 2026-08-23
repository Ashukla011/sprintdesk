import type { PlaceholderPost } from "../types/notification";

export async function fetchNotifications() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=5",
  );
  if (!response.ok) throw new Error("Unable to load notifications");
  return response.json() as Promise<PlaceholderPost[]>;
}
