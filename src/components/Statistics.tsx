import { Mode } from "@/enums/Mode";

interface StatsProps {
  finished: boolean;
  seconds: number;
  wpm: number;
  isTyping: boolean;
  accuracy: number;
  onTimeSelect: (time: number) => void;
  onModeSelect: (mode: Mode) => void;
  selectedMode: Mode;
}

export default function Statistics({
  finished,
  seconds,
  wpm,
  isTyping,
  accuracy,
  onTimeSelect,
  onModeSelect,
  selectedMode,
}: StatsProps) {
  return (
    <div className="h-12">
      <div className="m-0 font-normal text-4xl text-[#e2b714] font-roboto ">
        {!isTyping ? (
          finished ? (
            <div className="flex justify-between">
              <div>
                <span className="">{wpm}</span> wpm
              </div>
              <div className="">
                <span>{accuracy.toFixed(2)}% accuracy</span>
              </div>
            </div>
          ) : (
            <div className="text-[#646669] bg-[#2c2e31] rounded-md flex  text-lg py-3 px-3 justify-center  items-center">
              <div className="flex gap-10 w-1/2 justify-center">
                {[15, 30, 60, 120].map((time) => (
                  <button
                    key={time}
                    onClick={() => onTimeSelect(time)}
                    className={`transition-all  ${
                      seconds === time
                        ? "text-[#e2b714]"
                        : "hover:text-[#D1D0C5]"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              <hr className="h-5 w-1 bg-[#323437] border-none rounded-sm" />
              <div className="flex gap-10 w-1/2 justify-center">
                {Object.values(Mode).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => onModeSelect(mode)}
                    className={`transition-all ${
                      selectedMode === mode
                        ? "text-[#e2b714]"
                        : "hover:text-[#D1D0C5]"
                    }`}
                  >
                    {mode.charAt(0) + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )
        ) : (
          <div className="flex items-center gap-2 text-5xl">
            <span className="">{seconds}</span>
          </div>
        )}
      </div>
    </div>
  );
}
