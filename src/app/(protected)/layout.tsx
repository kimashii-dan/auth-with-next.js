"use client";
import "../globals.css";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import Profile from "../../../public/profile.svg";
import Github from "../../../public/github.svg";
import Email from "../../../public/email.svg";
import Poop from "../../../public/images/Poop.png";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-[80%] min-h-screen flex flex-col my-3 gap-5 text-[#d1d0c5] ">
      <div className="flex py-5 rounded-lg items-center justify-between">
        <Link className=" flex items-center gap-2" href="/dashboard">
          <Image src={Poop} alt="logo" width={40} height={40} priority />
          <span className="text-3xl text-[#e2b714] font-roboto">typeshi</span>
        </Link>

        <Link
          className="font-roboto text-[#646669] hover:text-[#D1D0C5] text-xl transition-all"
          href="/game"
        >
          Play
        </Link>

        <Link
          className="font-roboto text-[#646669] hover:text-[#D1D0C5] text-xl transition-all"
          href="/"
        >
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
