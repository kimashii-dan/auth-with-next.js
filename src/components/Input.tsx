import { ChangeEvent, useEffect, useRef } from "react";
import Image from "next/image";
import Restart from "../../public/restart.svg";
import { Mode } from "@/enums/Mode";
import TextImage from "../../public/images/text.png";
interface InputProps {
  input: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  finished: boolean;
  restart: (mode: Mode) => void;
  selectedMode: Mode;
  isTyping: boolean;
}

export default function Input({
  input,
  handleChange,
  finished,
  restart,
  selectedMode,
  isTyping,
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex justify-between relative">
      {!isTyping && (
        <div className="absolute -left-24 top-14">
          <Image src={TextImage} alt="text here" width={75} />
        </div>
      )}

      <input
        type="text"
        placeholder="Type the above text here when the race begins..."
        value={input}
        onChange={handleChange}
        disabled={finished}
        className="w-[45%] text-lg text-[#D1D0C5] p-3 bg-[#2c2e31] rounded-md placeholder:text-[#646669]"
        ref={inputRef}
      />

      <button
        onClick={() => restart(selectedMode)}
        className="p-3 bg-[#2c2e31] cursor-pointer rounded-md flex gap-2 w-32 items-center justify-center  transition-all group"
      >
        Restart
        <div className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-[360deg]">
          <Image src={Restart} alt="restart" />
        </div>
      </button>
    </div>
  );
}
