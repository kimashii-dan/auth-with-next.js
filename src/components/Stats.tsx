interface StatsProps {
  words: number;
  seconds: number;
  wpm: number;
  isTyping: boolean;
}

export default function Stats({ words, seconds, wpm, isTyping }: StatsProps) {
  return (
    <div>
      <h1 className="m-0 font-normal text-[2.5rem] text-[#e2b714] font-roboto">
        {!isTyping ? (
          words > 0 ? (
            <>
              <span className="text-[#e2b714]">{wpm}</span> wpm{" "}
            </>
          ) : (
            <span className="text-[#323437]">LOOOL</span>
          )
        ) : (
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap min-w-[50px] inline-block text-right">
              {seconds}
            </span>
          </div>
        )}
      </h1>
    </div>
  );
}
