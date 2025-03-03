"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Profile from "../../public/profile.svg";
import Poop from "../../public/images/Poop.png";

export default function Header() {
  const pathname = usePathname();

  return (
    <div className="flex py-5 rounded-lg items-center justify-between">
      <Link
        className="flex items-center gap-2 w-fit transition-all duration-200"
        href="/"
      >
        <Image src={Poop} alt="logo" width={40} height={40} priority />
        <span className="text-3xl text-[#e2b714] font-roboto">typeshi</span>
      </Link>

      {[
        { href: "/game", label: "Play" },
        { href: "/about", label: "About" },
        { href: "/profile", label: "Profile", isImage: true },
      ].map(({ href, label, isImage }) => (
        <Link
          key={href}
          href={href}
          className={`font-roboto text-xl transition-all duration-75 ${
            pathname === href
              ? "text-[#D1D0C5] "
              : "hover:text-[#D1D0C5] text-[#646669] focus:text-[#D1D0C5]"
          } ${isImage ? "p-1 rounded-full" : ""}`}
        >
          {isImage ? (
            <Image
              src={Profile}
              alt="profile"
              width={40}
              height={40}
              className={`transition-all ${
                pathname === href
                  ? "brightness-150"
                  : "hover:brightness-100 hover:filter hover:invert"
              } `}
              priority
            />
          ) : (
            label
          )}
        </Link>
      ))}
    </div>
  );
}
