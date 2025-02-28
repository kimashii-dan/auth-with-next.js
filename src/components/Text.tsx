import React, { useRef, useEffect, useState } from "react";
import Loader from "./Loader";

interface TextProps {
  splitted: string[][];
  finished: boolean;
  isTyping: boolean;
  cursorIndex: number;
  loading: boolean;
  error: string;
}

export default function Text({
  splitted,
  finished,
  isTyping,
  cursorIndex,
  loading,
  error,
}: TextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  const [lineOffset, setLineOffset] = useState(0);
  const lineHeight = 50;

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

  useEffect(() => {
    const currentLine = Math.floor(cursorPosition.top / lineHeight);
    setLineOffset(currentLine * lineHeight);
  }, [cursorPosition]);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      className="relative"
      style={{ height: `${lineHeight * 3}px`, overflow: "hidden" }}
    >
      <div
        ref={textRef}
        className="text-4xl font-roboto relative leading-snug transition-transform"
        style={{ transform: `translateY(-${lineOffset}px)` }}
      >
        {splitted.map((word, wordIdx) => (
          <span key={wordIdx} className="inline-block">
            {word.map((char, charIdx) => {
              const charIndexGlobal =
                splitted
                  .slice(0, wordIdx)
                  .reduce((sum, w) => sum + w.length, 0) + charIdx;
              return (
                <span
                  key={charIdx}
                  data-char
                  style={{
                    color:
                      charIndexGlobal < cursorIndex ? "#D1D0C5" : "#646669",
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              );
            })}
          </span>
        ))}
      </div>

      {!finished && (
        <div
          className={`absolute w-cursor rounded-md h-10 bg-[#e2b714] transition-all ${
            isTyping ? "" : "animate-cursor"
          }`}
          style={{
            top: `${cursorPosition.top - lineOffset}px`,
            left: `${cursorPosition.left}px`,
          }}
        ></div>
      )}
    </div>
  );
}
