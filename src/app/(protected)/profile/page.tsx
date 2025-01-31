/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import "../../globals.css";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import ArrowRight from "../../../../public/arrow-right.svg";
import axios from "axios";

export default function UserProfile() {
  const {
    user: userData,
    stats: userStats,
    races: userRaces,
    loading,
    error,
    fetchUserData,
  } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

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
    <div className="relative flex flex-col gap-10">
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

      <h1 className="text-4xl mt-5">Recent Races</h1>

      {userRaces?.map((race) => (
        <div
          key={race._id}
          className="flex justify-between py-8 px-12 rounded-lg bg-[#2c2e31] font-roboto"
        >
          <div className="text-[#e2b714]">
            <p className=" text-sm">wpm:</p>
            <span className="text-4xl">{race.WPM}</span>
          </div>
          <div>
            <p className="text-[#646669] text-sm">accuracy:</p>
            <span className="text-4xl">{race.accuracy.toFixed(2)}</span>
          </div>
          <div>
            <p className="text-[#646669] text-sm">selected time:</p>
            <span className="text-4xl">{race.selectedTime}</span>
          </div>
        </div>
      ))}

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
