/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import "../../globals.css";
import UserType from "@/app/types/UserType";

export default function UserProfile() {
  const [userData, setUserData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/protected`);
        console.log(response.data);
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
      <div className="flex gap-4 items-center">
        <Image
          src={userData?.avatar || "/profile.svg"}
          alt="default"
          width={90}
          height={90}
        />
        <p className="text-4xl">{userData?.username}</p>
      </div>
      <p>Email: {userData?.email}</p>
    </div>
  );
}
