import { getUserData } from "@/util/getUserData";
import Link from "next/link";
import React from "react";

export default async function Dashboard() {
  try {
    const response = await getUserData();
    const { user_data } = response;

    return (
      <div className="flex flex-col justify-center gap-8 p-7 rounded-lg bg-[#2c2e31] font-roboto">
        <h1 className="text-4xl">Welcome {user_data?.username}!</h1>
        <Link
          href={"/game"}
          className="bg-[#e2b714] text-[#2c2e31] w-1/6 p-4 rounded-md font-medium text-lg hover:-translate-y-1 transition-all text-center"
        >
          <span>Start game</span>
        </Link>
      </div>
    );
  } catch (error) {
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return (
      <div className="flex flex-col justify-center gap-8 p-7 rounded-lg bg-[#2c2e31] font-roboto">
        <p className="text-red-500">
          Failed to load user data. Please try again. Error: {errorMessage}
        </p>
      </div>
    );
  }
}
