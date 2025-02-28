import Github from "../../public/github.svg";
import Email from "../../public/email.svg";
import Image from "next/image";
import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
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
  );
}
