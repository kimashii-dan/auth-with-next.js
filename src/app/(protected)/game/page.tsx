"use client";
import {
  useEffect,
  useCallback,
  ChangeEvent,
  useMemo,
  useReducer,
} from "react";
import axios from "axios";
import Statistics from "@/components/Statistics";
import ProgressBar from "@/components/ProgressBar";
import Text from "@/components/Text";
import Input from "@/components/Input";
import GameType from "@/types/GameType";

const initialText =
  "If a document does not have a value for the indexed field in a unique index, the index will store a null value for this document.";

type Action =
  | { type: "INPUT_CHANGED"; payload: string }
  | { type: "TICK" }
  | { type: "FINISH_GAME" }
  | { type: "RESTART" }
  | { type: "SET_SELECTED_TIME"; payload: number };

const initialState: GameType = {
  input: "",
  wordIndex: 0,
  charIndex: 0,
  wordsTyped: 0,
  isTyping: false,
  timeLeft: 60,
  selectedTime: 60,
  wpm: 0,
  cursorIndex: 0,
  finished: false,
  mistakes: 0,
};

export default function Game() {
  const wordsArray = useMemo(
    () => initialText.split(" ").map((word) => [...word, " "]),
    []
  );

  const totalCharacters = useMemo(
    () => wordsArray.flat().length - 1,
    [wordsArray]
  );

  const reducer = (state: GameType, action: Action): GameType => {
    switch (action.type) {
      case "INPUT_CHANGED": {
        const currentInput = action.payload;
        const currentWord = wordsArray[state.wordIndex];
        const currentWordLength = currentWord.length;

        const newState = { ...state, input: currentInput };

        if (!newState.isTyping) {
          newState.isTyping = true;
        }

        if (currentInput.length < state.input.length) {
          const expectedInput = currentWord
            .slice(0, state.charIndex - 1)
            .join("");
          if (currentInput === expectedInput) {
            newState.charIndex = state.charIndex - 1;
            newState.cursorIndex = state.cursorIndex - 1;
          }
        } else {
          const currentChar = currentInput[state.charIndex];
          const correctChar = currentWord[state.charIndex];

          if (currentChar === correctChar) {
            if (currentInput.length === currentWordLength) {
              newState.wordIndex += 1;
              newState.charIndex = 0;
              newState.input = "";
              newState.wordsTyped += 1;
              newState.cursorIndex += currentWordLength - state.charIndex;
            } else {
              newState.charIndex += 1;
              newState.cursorIndex += 1;
            }

            if (newState.wordIndex >= wordsArray.length) {
              const elapsedTime = newState.selectedTime - newState.timeLeft;
              const finalWPM = Math.floor(
                newState.wordsTyped / (elapsedTime / 60)
              );
              return {
                ...newState,
                finished: true,
                isTyping: false,
                wpm: finalWPM,
              };
            }

            if (
              state.wordIndex === wordsArray.length - 1 &&
              currentInput.length === currentWordLength - 1
            ) {
              const elapsedTime = newState.selectedTime - newState.timeLeft;
              const finalWPM = Math.floor(
                (newState.wordsTyped + 1) / (elapsedTime / 60)
              );
              return {
                ...newState,
                input: "",
                wordIndex: wordsArray.length,
                finished: true,
                isTyping: false,
                wpm: finalWPM,
                wordsTyped: newState.wordsTyped + 1,
              };
            }
          } else {
            newState.mistakes += 1;
          }
        }

        return newState;
      }

      case "TICK":
        return { ...state, timeLeft: state.timeLeft - 1 };

      case "FINISH_GAME": {
        const elapsedTime = state.selectedTime - state.timeLeft;
        const finalWPM = Math.floor(state.wordsTyped / (elapsedTime / 60));
        return {
          ...state,
          finished: true,
          isTyping: false,
          wpm: finalWPM,
          input: "",
        };
      }

      case "RESTART":
        return {
          ...initialState,
          selectedTime: state.selectedTime,
          timeLeft: state.selectedTime,
        };

      case "SET_SELECTED_TIME":
        return {
          ...initialState,
          selectedTime: action.payload,
          timeLeft: action.payload,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const typedCharacters = useMemo(
    () => wordsArray.slice(0, state.wordIndex).flat().length + state.charIndex,
    [state.wordIndex, state.charIndex, wordsArray]
  );

  const progress = useMemo(
    () => Math.min((typedCharacters / totalCharacters) * 100, 100),
    [typedCharacters, totalCharacters]
  );

  const accuracy = useMemo(
    () =>
      state.finished
        ? ((totalCharacters - state.mistakes) / totalCharacters) * 100
        : 100,
    [state.finished, state.mistakes, totalCharacters]
  );

  useEffect(() => {
    if (!state.isTyping || state.timeLeft <= 0) return;
    const timer = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(timer);
  }, [state.isTyping, state.timeLeft]);

  useEffect(() => {
    if (state.timeLeft === 0) {
      dispatch({ type: "FINISH_GAME" });
    }
  }, [state.timeLeft]);

  useEffect(() => {
    if (state.finished) {
      const sendStats = async () => {
        try {
          await axios.post("/api/users/stats", { wpm: state.wpm });
        } catch (error) {
          console.error("Failed to submit stats:", error);
        }
      };
      sendStats();
    }
  }, [state.finished, state.wpm]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "INPUT_CHANGED", payload: e.target.value });
  }, []);

  const handleTimeSelect = useCallback((time: number) => {
    dispatch({ type: "SET_SELECTED_TIME", payload: time });
  }, []);

  const restart = useCallback(() => dispatch({ type: "RESTART" }), []);

  return (
    <div className="flex flex-col justify-center gap-7 rounded-lg font-roboto">
      <div className="flex text-[#D1D0C5] flex-col gap-[65px] py-6">
        <Statistics
          isTyping={state.isTyping}
          finished={state.finished}
          seconds={state.timeLeft}
          wpm={state.wpm}
          onTimeSelect={handleTimeSelect}
          accuracy={accuracy}
        />

        <ProgressBar progress={progress} />

        <Text
          splitted={wordsArray}
          isTyping={state.isTyping}
          finished={state.finished}
          cursorIndex={state.cursorIndex}
        />

        <Input
          input={state.input}
          handleChange={handleChange}
          finished={state.finished}
          restart={restart}
        />
      </div>
    </div>
  );
}
