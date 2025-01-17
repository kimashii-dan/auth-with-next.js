/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import "../globals.css";
import Image from "next/image";
import HellYeah from "../../../public/images/hell_yeah.png";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import Link from "next/link";
import ArrowLeft from "../../../public/arrow-left.svg";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  async function logout() {
    try {
      await axios.get("/api/users/logout");
      router.push("/login");
    } catch (error: any) {
      console.error(error.response?.data?.error || "Logout failed");
    }
  }

  return (
    <div className="mx-auto w-[80%] min-h-screen flex flex-col mt-3 gap-5 text-[#d1d0c5]">
      <div className="flex gap-7 py-7 rounded-lg items-center justify-between">
        <Link href="/dashboard">
          <Image
            priority={true}
            src={HellYeah}
            alt="logo"
            width={75}
            height={75}
          />
        </Link>
        <button
          onClick={logout}
          className="bg-[#2c2e31] p-3 rounded-md font-roboto"
        >
          Logout
        </button>
      </div>
      {children}
      <button
        onClick={() => router.back()}
        className="bg-[#2c2e31] p-3 rounded-md font-roboto w-32 flex gap-2"
      >
        <Image src={ArrowLeft} alt="arrow left" />
        Go Back
      </button>
    </div>
  );
}
