import { ChangeEvent } from "react";
import Image from "next/image";
import Restart from "../../public/restart.svg";
interface InputProps {
  input: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isTyping: boolean;
  seconds: number;
  words: number;
  restart: () => void;
}

export default function Input({
  input,
  handleChange,
  isTyping,
  seconds,
  words,
  restart,
}: InputProps) {
  return (
    <div className="flex justify-between">
      <input
        type="text"
        placeholder="Type the above text here when the race begins..."
        value={input}
        onChange={handleChange}
        disabled={!isTyping && (seconds === 0 || words > 0)}
        className="w-[45%] text-lg text-[#D1D0C5] p-3 bg-[#2c2e31] rounded-md placeholder:text-[#646669]"
      />

      <button
        onClick={restart}
        className=" p-3 bg-[#2c2e31] cursor-pointer rounded-md flex gap-2 w-32 items-center justify-center"
      >
        Restart
        <Image src={Restart} alt="restart" />
      </button>
    </div>
  );
}
