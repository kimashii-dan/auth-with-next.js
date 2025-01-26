"use client";
import { useState, useEffect, useCallback, ChangeEvent } from "react";
import axios from "axios";
import Statistics from "@/components/Statistics";
import ProgressBar from "@/components/ProgressBar";
import Text from "@/components/Text";
import Input from "@/components/Input";

const initialText =
  "If a document does not have a value for the indexed field in a unique index, the index will store a null value for this document.";
const wordsArray = initialText.split(" ").map((word) => [...word, " "]);

const calculateWPM = (wordsTyped: number, elapsedTime: number): number => {
  if (elapsedTime === 0) return 0;
  return Math.floor(wordsTyped / (elapsedTime / 60));
};

export default function Game() {
  const [input, setInput] = useState<string>("");
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [charIndex, setCharIndex] = useState<number>(0);
  const [wordsTyped, setWordsTyped] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [selectedTime, setSelectedTime] = useState<number>(60);
  const [wpm, setWPM] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [cursorIndex, setCursorIndex] = useState<number>(0);

  const totalCharacters = wordsArray.flat().length - 1;

  useEffect(() => {
    if (!isTyping || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isTyping, timeLeft]);

  const finishGame = useCallback(async () => {
    setIsTyping(false);
    const elapsedTime = selectedTime - timeLeft;
    const finalWPM = calculateWPM(wordsTyped, elapsedTime);
    setWPM(finalWPM);
    setInput("");
    console.log("Game finished, WPM:", finalWPM);

    try {
      const response = await axios.post("/api/users/stats", { wpm: finalWPM });
      console.log(response.data);
    } catch (error) {
      console.error("Failed to submit stats:", error);
    }
  }, [timeLeft, wordsTyped, selectedTime]);

  useEffect(() => {
    if (timeLeft === 0) {
      finishGame();
    }
  }, [timeLeft, finishGame]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentInput = e.target.value;
    const currentWord = wordsArray[wordIndex];

    setInput(currentInput);

    if (!isTyping) setIsTyping(true);

    if (
      currentInput.length < input.length &&
      currentInput === currentWord.slice(0, charIndex - 1).join("")
    ) {
      setCharIndex((prev) => prev - 1);
      setCursorIndex((prev) => prev - 1);
    } else if (currentInput[charIndex] === currentWord[charIndex]) {
      if (currentInput.length === currentWord.length) {
        moveToNextWord();
      } else {
        setCharIndex((prev) => prev + 1);
      }
      setCursorIndex((prev) => prev + 1);

      if (
        currentInput.length === currentWord.length - 1 &&
        wordIndex + 1 === wordsArray.length
      ) {
        moveToNextWord();
        finishGame();
      }
    }

    updateProgress();
  };

  const moveToNextWord = () => {
    setWordIndex((prevIndex) => prevIndex + 1);
    setCharIndex(0);
    setInput("");
    setWordsTyped((prev) => prev + 1);
  };

  const updateProgress = () => {
    const correctlyTypedCharacters =
      wordsArray.slice(0, wordIndex).flat().length + charIndex + 1;
    setProgress(
      Math.min((correctlyTypedCharacters / totalCharacters) * 100, 100)
    );
  };

  const resetGameState = () => {
    setInput("");
    setWordIndex(0);
    setCharIndex(0);
    setWordsTyped(0);
    setIsTyping(false);
    setProgress(0);
    setCursorIndex(0);
  };

  const restartGame = () => {
    resetGameState();
    setTimeLeft(selectedTime);
    setWPM(0);
  };

  const handleTimeSelect = (time: number) => {
    setSelectedTime(time);
    setTimeLeft(time);
    resetGameState();
  };

  return (
    <div className="flex flex-col justify-center gap-7 rounded-lg font-roboto">
      <div className="flex text-[#D1D0C5] flex-col gap-[65px] py-6">
        {/* Stats */}
        <Statistics
          isTyping={isTyping}
          words={wordsTyped}
          seconds={timeLeft}
          wpm={wpm}
          onTimeSelect={handleTimeSelect}
        />

        {/* Progress Bar */}
        <ProgressBar progress={progress} />

        {/* Text */}
        <Text
          splitted={wordsArray}
          isTyping={isTyping}
          seconds={timeLeft}
          words={wordsTyped}
          cursorIndex={cursorIndex}
        />

        {/* Input */}
        <Input
          input={input}
          handleChange={handleChange}
          isTyping={isTyping}
          seconds={timeLeft}
          words={wordsTyped}
          restart={restartGame}
        />
      </div>
    </div>
  );
}
