import React, { useRef, useEffect, useState } from "react";

interface TextProps {
  splitted: string[][];
  finished: boolean;
  isTyping: boolean;
  cursorIndex: number;
}

export default function Text({
  splitted,
  finished,
  isTyping,
  cursorIndex,
}: TextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!textRef.current) return;
    const textNode = textRef.current;
    const charElements = textNode.querySelectorAll<HTMLElement>("[data-char]");

    if (cursorIndex < charElements.length) {
      const charElement = charElements[cursorIndex];
      const { offsetLeft, offsetTop } = charElement;
      setCursorPosition({ top: offsetTop, left: offsetLeft });
    }
  }, [cursorIndex, splitted]);

  return (
    <div ref={textRef} className="text-4xl font-roboto relative">
      {splitted.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block">
          {word.map((char, charIdx) => {
            const charIndexGlobal =
              splitted.slice(0, wordIdx).reduce((sum, w) => sum + w.length, 0) +
              charIdx;
            return (
              <span
                key={charIdx}
                data-char
                style={{
                  color: charIndexGlobal < cursorIndex ? "#D1D0C5" : "#646669",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            );
          })}
        </span>
      ))}
      {!finished && (
        <div
          className={`absolute w-[3px] rounded-[5px] h-10 bg-[#e2b714] transition-all ${
            isTyping ? "" : "animate-cursor"
          }`}
          style={{
            top: `${cursorPosition.top}px`,
            left: `${cursorPosition.left}px`,
          }}
        ></div>
      )}
    </div>
  );
}
