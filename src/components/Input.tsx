import { ChangeEvent } from "react";
import Image from "next/image";
import Restart from "../../public/restart.svg";
import { Mode } from "@/enums/Mode";
interface InputProps {
  input: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  finished: boolean;
  restart: (mode: Mode) => void;
  selectedMode: Mode;
}

export default function Input({
  input,
  handleChange,
  finished,
  restart,
  selectedMode,
}: InputProps) {
  return (
    <div className="flex justify-between">
      <input
        type="text"
        placeholder="Type the above text here when the race begins..."
        value={input}
        onChange={handleChange}
        disabled={finished}
        className="w-[45%] text-lg text-[#D1D0C5] p-3 bg-[#2c2e31] rounded-md placeholder:text-[#646669]"
      />

      <button
        onClick={() => restart(selectedMode)}
        className=" p-3 bg-[#2c2e31] cursor-pointer rounded-md flex gap-2 w-32 items-center justify-center"
      >
        Restart
        <Image src={Restart} alt="restart" />
      </button>
    </div>
  );
}
