/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Image from "next/image";
import "../../globals.css";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import ArrowRight from "../../../../public/arrow-right.svg";

import api from "@/util/axiosInstance";

export default function UserProfile() {
  const {
    user: userData,
    stats: userStats,
    races: userRaces,
    clearUser,
  } = useUserStore();
  const router = useRouter();

  async function logout() {
    try {
      clearUser();
      await api.get("/users/logout");
      router.push("/login");
    } catch (error: any) {
      console.error(error.response?.data?.error || "Logout failed");
    }
  }

  return (
    <div className="relative flex flex-col gap-10">
      <div className="flex flex-col justify-center gap-8 p-7 rounded-lg bg-[#2c2e31] font-roboto">
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
            <span className="text-4xl text-[#e2b714]">
              {userStats?.highest_WPM}
            </span>
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
        <div className="flex justify-between items-center">
          <p>Email: {userData?.email}</p>
          <button
            onClick={logout}
            className="bg-[#323437] p-3 rounded-md font-roboto w-32 ml-auto flex gap-2 border-[#D1D0C5]-100 border-solid border-2 hover:-translate-y-1 transition-all"
          >
            <Image src={ArrowRight} alt="arrow left" />
            Logout
          </button>
        </div>
      </div>

      <h1 className="text-4xl mt-7 font-roboto">Recent Tests</h1>

      {userRaces?.map((race) => (
        <div
          key={race._id}
          className="flex flex-col py-8 px-10 rounded-lg bg-[#2c2e31] font-roboto gap-5"
        >
          <div className="flex justify-between items-center">
            <div className="">
              <p className="text-[#646669] text-sm">wpm:</p>
              <span className="text-3xl ">{race.WPM}</span>
            </div>
            <div className="">
              <p className="text-[#646669] text-sm">accuracy:</p>
              <span className="text-3xl">{race.accuracy.toFixed(2)}</span>
            </div>
            <div className="">
              <p className="text-[#646669] text-sm">selected time:</p>
              <span className="text-3xl">{race.selectedTime}</span>
            </div>
            <div className="">
              <p className="text-[#646669] text-sm">selected mode:</p>
              <span className="text-3xl">{race.selectedMode}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-[#646669] text-sm">progress:</p>
            <div className="w-full h-2 bg-[#646669] rounded-md ">
              <div
                style={{ width: `${race.progress}%` }}
                className={` h-2 bg-[#e2b714] rounded-md`}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
