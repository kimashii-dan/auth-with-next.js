interface StatsProps {
  finished: boolean;
  seconds: number;
  wpm: number;
  isTyping: boolean;
  onTimeSelect: (time: number) => void;
  accuracy: number;
}

export default function Statistics({
  finished,
  seconds,
  wpm,
  isTyping,
  onTimeSelect,
  accuracy,
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
            <div className="text-[#646669] bg-[#2c2e31] rounded-md flex gap-5 text-lg py-3 px-4 justify-center">
              {[15, 30, 60, 120].map((time) => (
                <button
                  key={time}
                  onClick={() => onTimeSelect(time)}
                  className={`transition-all  ${
                    seconds === time ? "text-[#e2b714]" : "hover:text-[#D1D0C5]"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          )
        ) : (
          <div className="flex items-center gap-2">
            <span className="">{seconds}</span>
          </div>
        )}
      </div>
    </div>
  );
}
