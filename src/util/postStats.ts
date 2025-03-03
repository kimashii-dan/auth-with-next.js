import { controlledFetch } from "./controlledFetch";
import { Mode } from "@/enums/Mode";

type postStatsData = {
  wpm: number;
  accuracy: number;
  selectedTime: number;
  progress: number;
  selectedMode: Mode;
};

export async function postStats(stats: postStatsData) {
  const response = await controlledFetch(
    "http://localhost:3000/api/users/stats",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stats),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to post stats.");
  }

  return response.json();
}
