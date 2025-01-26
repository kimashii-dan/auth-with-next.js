/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import "../../globals.css";
import UserType from "@/app/types/UserType";
import StatsType from "@/app/types/StatsType";
import { useRouter } from "next/navigation";
import ArrowRight from "../../../../public/arrow-right.svg";

export default function UserProfile() {
  const [userData, setUserData] = useState<UserType | null>(null);
  const [userStats, setUserStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/protected`);
        console.log(response.data);
        setUserData(response.data.user_data);
        setUserStats(response.data.stats_data);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  async function logout() {
    try {
      await axios.get("/api/users/logout");
      router.push("/login");
    } catch (error: any) {
      console.error(error.response?.data?.error || "Logout failed");
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="relative">
      <div className="flex flex-col justify-center gap-7 p-7 rounded-lg bg-[#2c2e31] font-roboto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={userData?.avatar || "/profile.svg"}
              alt="default"
              width={80}
              height={80}
            />
            <p className="text-3xl">{userData?.username}</p>
          </div>

          <div>
            <p className="text-[#646669] text-sm">highest wpm:</p>
            <span className="text-4xl">{userStats?.highest_WPM}</span>
          </div>

          <div>
            <p className="text-[#646669] text-sm">average wpm:</p>
            <span className="text-4xl">{userStats?.average_WPM}</span>
          </div>

          <div>
            <p className="text-[#646669] text-sm">amount of races:</p>
            <span className="text-4xl">{userStats?.races_amount}</span>
          </div>
        </div>
        <p>Email: {userData?.email}</p>
      </div>
      <div className="absolute -top-[68px] right-0">
        <button
          onClick={logout}
          className="bg-[#2c2e31] p-3 rounded-md font-roboto w-32 ml-auto flex gap-2"
        >
          <Image src={ArrowRight} alt="arrow left" />
          Logout
        </button>
      </div>
    </div>
  );
}
