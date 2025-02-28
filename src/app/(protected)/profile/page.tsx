"use client";
import React from "react";
import "../../globals.css";
import { useUserStore } from "@/store/userStore";

import Test from "@/components/Tests";
import MainUserData from "@/components/MainUserData";

export default function UserProfile() {
  const { races: userRaces } = useUserStore();

  return (
    <div className="relative flex flex-col gap-10">
      <MainUserData />

      <h1 className="text-4xl mt-7 font-roboto">Recent Tests</h1>

      {userRaces?.length ? (
        userRaces.map((race) => <Test race={race} key={race._id} />)
      ) : (
        <p>No races found</p>
      )}
    </div>
  );
}
