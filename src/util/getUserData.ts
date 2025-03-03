import { controlledFetch } from "./controlledFetch";

export async function getUserData() {
  const response = await controlledFetch(
    "http://localhost:3000/api/users/protected"
  );

  if (!response.ok) throw new Error("Failed to fetch protected data");
  return response.json();
}
