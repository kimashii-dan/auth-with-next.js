"use client";
import "../globals.css";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import React from "react";
import Link from "next/link";
// import ArrowLeft from "../../../public/arrow-left.svg";
import Profile from "../../../public/profile.svg";
import Github from "../../../public/github.svg";
import Email from "../../../public/email.svg";
import Poop from "../../../public/images/Poop.png";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const router = useRouter();

  return (
    <div className="mx-auto w-[80%] min-h-screen flex flex-col my-3 gap-5 text-[#d1d0c5]">
      <div className="flex py-5 rounded-lg items-center justify-between">
        <Link className=" flex items-center gap-2" href="/dashboard">
          <Image src={Poop} alt="logo" width={40} height={40} priority />
          <span className="text-3xl text-[#e2b714] font-roboto">Typeshi</span>
        </Link>

        <Link className="font-roboto text-[#e2b714] text-xl" href="/game">
          Play
        </Link>

        <Link className="font-roboto text-[#e2b714] text-xl" href="/">
          About
        </Link>

        <Link href="/profile">
          <Image
            src={Profile}
            alt="logo"
            width={40}
            height={40}
            className="hover:filter hover:invert hover:brightness-50  transition-all"
            priority
          />
        </Link>
      </div>

      {/* <button
        onClick={() => router.back()}
        className="bg-[#2c2e31] p-3 rounded-md font-roboto w-32 flex gap-2"
      >
        <Image src={ArrowLeft} alt="arrow left" />
        Go Back
      </button> */}
      <div className="flex-grow">{children}</div>

      <div className="flex gap-4 pb-5 rounded-lg items-center ">
        <Link href="https://github.com/kimashii-dan/auth-with-next.js">
          <Image
            src={Github}
            alt="github"
            width={25}
            height={25}
            className="hover:filter hover:invert hover:brightness-50 transition-all"
            priority
          />
        </Link>

        <Link href="mailto:daniyarmunsyzbaev@gmail.com">
          <Image
            src={Email}
            alt="email"
            width={25}
            height={25}
            className="hover:filter hover:invert hover:brightness-50 transition-all"
            priority
          />
        </Link>
      </div>
    </div>
  );
}
