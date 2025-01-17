interface TextProps {
  splitted: string[][];
  wordIndex: number;
  charIndex: number;
  isTyping: boolean;
}

export default function Text({
  splitted,
  wordIndex,
  charIndex,
  isTyping,
}: TextProps) {
  return (
    <div className="text-3xl relative font-roboto break-words">
      {splitted.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block">
          {word.map((char, charIdx) => {
            const isCursor = wordIdx === wordIndex && charIdx === charIndex;
            return (
              <span
                key={charIdx}
                style={{
                  color:
                    wordIdx < wordIndex ||
                    (wordIdx === wordIndex && charIdx < charIndex)
                      ? "#D1D0C5"
                      : "#646669",
                  position: isCursor ? "relative" : undefined,
                }}
              >
                {char === " " ? "\u00A0" : char}
                {isCursor && (
                  <span
                    className={`absolute top-1 left-0 w-[3px] rounded-[5px] h-8 bg-[#e2b714] ${
                      isTyping ? "" : "animate-blink"
                    }`}
                  />
                )}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
}
