"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, ChangeEvent } from "react";

import Stats from "@/components/Stats";
import ProgressBar from "@/components/ProgressBar";
import Text from "@/components/Text";
import Input from "@/components/Input";
const initial: string =
  "To create a blinking effect in CSS, simply adjust the opacity at different time frames, using keyframes and animation property in CSS.";
const splitted = initial.split(" ").map((word) => [...word, " "]);

export default function Game() {
  const [input, setInput] = useState<string>("");
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [charIndex, setCharIndex] = useState<number>(0);
  const [words, setWords] = useState<number>(0);
  const [isTyping, setTyping] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(90);
  const [wpm, setWPM] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const totalCharacters = splitted.flat().length - 1;

  useEffect(() => {
    let timer: NodeJS.Timeout | number;
    if (isTyping && seconds > 0) {
      timer = setInterval(() => setSeconds((prev) => prev - 1), 1000);
    }
    if (seconds === 0) {
      finish();
    }
    return () => clearInterval(timer);
  }, [isTyping, seconds]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const currentInput = e.target.value;
    const currentWord = splitted[wordIndex];
    setInput(currentInput);

    if (!isTyping) {
      setTyping(true);
    }

    if (
      currentInput.length < input.length &&
      currentInput === currentWord.slice(0, charIndex - 1).join("")
    ) {
      setCharIndex((prev) => prev - 1);
    } else {
      if (currentInput[charIndex] === currentWord[charIndex]) {
        if (currentInput.length === currentWord.length) {
          nextWord();
        } else {
          nextChar();
          if (
            currentInput.length === currentWord.length - 1 &&
            wordIndex + 1 === splitted.length
          ) {
            nextWord();
            finish();
          }
        }
      }
    }

    const correctlyTypedCharacters =
      splitted.slice(0, wordIndex).flat().length + charIndex + 1;
    setProgress(
      Math.min((correctlyTypedCharacters / totalCharacters) * 100, 93.5)
    );
    console.log(progress);
  };

  const restart = (): void => {
    setWords(0);
    setWordIndex(0);
    setCharIndex(0);
    setSeconds(90);
    setInput("");
    setTyping(false);
    setWPM(0);
    setProgress(0);
  };

  const finish = (): void => {
    setTyping(false);
    calculateWPM();
    setInput("");
  };

  const nextWord = (): void => {
    setWordIndex((prevIndex) => prevIndex + 1);
    setCharIndex(0);
    setInput("");
    setWords((prev) => prev + 1);
  };

  const nextChar = (): void => {
    setCharIndex((prev) => prev + 1);
  };

  const calculateWPM = (): void => {
    const totalTime = (90 - seconds) / 60;
    console.log(words, totalTime);
    setWPM(Math.floor(words / totalTime));
  };

  return (
    <div className="flex flex-col justify-center gap-7 rounded-lg  font-roboto">
      <div className=" flex text-[#D1D0C5] flex-col gap-[65px] py-[50px]">
        {/* stats */}

        <Stats isTyping={isTyping} words={words} seconds={seconds} wpm={wpm} />

        {/* progress bar */}
        <ProgressBar progress={progress} />

        {/* text */}
        <Text
          splitted={splitted}
          wordIndex={wordIndex}
          charIndex={charIndex}
          isTyping={isTyping}
        />

        {/* input */}
        <Input
          input={input}
          handleChange={handleChange}
          isTyping={isTyping}
          seconds={seconds}
          words={words}
          restart={restart}
        />
      </div>
    </div>
  );
}
