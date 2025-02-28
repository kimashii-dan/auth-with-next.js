import Image from "next/image";
import Link from "next/link";
import Profile from "../../public/profile.svg";
import Poop from "../../public/images/Poop.png";

export default function Header() {
  return (
    <div className="flex py-5 rounded-lg items-center justify-between">
      <Link
        className=" flex items-center gap-2  w-fit transition-all duration-200"
        href="/dashboard"
      >
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
  );
}
