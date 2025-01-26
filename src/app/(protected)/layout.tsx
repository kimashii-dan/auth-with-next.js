"use client";
import "../globals.css";
import Image from "next/image";
import HellYeah from "../../../public/images/hell_yeah.png";
import { useRouter } from "next/navigation";
import React from "react";
import Link from "next/link";
import ArrowLeft from "../../../public/arrow-left.svg";
import Profile from "../../../public/profile.svg";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="mx-auto w-[80%] min-h-screen flex flex-col my-3 gap-5 text-[#d1d0c5]">
      <div className="flex gap-4 py-5 rounded-lg items-center justify-between">
        <Link href="/dashboard">
          <Image
            priority={true}
            src={HellYeah}
            alt="logo"
            width={60}
            height={60}
          />
        </Link>

        <Link href="/profile">
          <Image
            priority={true}
            src={Profile}
            alt="logo"
            width={40}
            height={40}
          />
        </Link>
      </div>

      <button
        onClick={() => router.back()}
        className="bg-[#2c2e31] p-3 rounded-md font-roboto w-32 flex gap-2"
      >
        <Image src={ArrowLeft} alt="arrow left" />
        Go Back
      </button>
      {children}
    </div>
  );
}
