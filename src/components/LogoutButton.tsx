"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ArrowRight from "../../public/arrow-right.svg";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    try {
      await fetch("http://localhost:3000/api/users/logout", {
        method: "GET",
        credentials: "include",
      });
      router.push("/login");
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Logout failed");
    }
  }

  return (
    <button
      onClick={logout}
      className="bg-[#323437] p-3 rounded-md font-roboto w-32 ml-auto flex gap-2 border-[#D1D0C5]-100 border-solid border-2 hover:-translate-y-1 transition-all"
    >
      <Image src={ArrowRight} alt="arrow left" />
      Logout
    </button>
  );
}
