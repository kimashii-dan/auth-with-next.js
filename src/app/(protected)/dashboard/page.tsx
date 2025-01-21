/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import UserType from "@/app/types/UserType";

export default function Dashboard() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserType | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/protected`);
        console.log(response);
        setUserData(response.data.data);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div className="flex flex-col justify-center gap-7 p-7 rounded-lg bg-[#2c2e31] font-roboto">
      <h1 className="text-4xl">Dashboard</h1>

      <h2 className="text-3xl">Welcome {userData?.username}!</h2>

      <Link href={"/profile"}>
        <u>Go to profile</u>
      </Link>

      <Link href={"/game"}>
        <u>Start game</u>
      </Link>
    </div>
  );
}
