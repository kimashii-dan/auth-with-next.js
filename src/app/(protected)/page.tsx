"use client";
import Link from "next/link";
import React from "react";

import { useUserStore } from "@/store/userStore";
import Loader from "@/components/Loader";

export default function Dashboard() {
  const { user: userData, error, loading } = useUserStore();

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col justify-center gap-8 p-7 rounded-lg bg-[#2c2e31] font-roboto">
      <h1 className="text-4xl">Welcome {userData?.username}!</h1>

      {error}

      <Link
        href={"/game"}
        className="bg-[#e2b714] text-[#2c2e31] w-1/6 p-4 rounded-md font-medium text-lg hover:-translate-y-1 transition-all text-center"
      >
        <span>Start game</span>
      </Link>
    </div>
  );
}
