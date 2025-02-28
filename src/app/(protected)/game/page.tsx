/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  useEffect,
  useCallback,
  ChangeEvent,
  useMemo,
  useReducer,
  useState,
} from "react";
import Statistics from "@/components/Statistics";
import ProgressBar from "@/components/ProgressBar";
import Text from "@/components/Text";
import Input from "@/components/Input";
import GameType from "@/types/GameType";
import { getRandomSentence } from "@/util/getRandomSentence";
import { Mode } from "@/enums/Mode";
import { getRandomQuote } from "@/util/getRandomQuote";
import { getRandomWords } from "@/util/getRandomWords";
import api from "@/util/axiosInstance";

type Action =
  | { type: "GENERATE_TEXT"; payload: { mode: Mode; text: string } }
  | { type: "INPUT_CHANGED"; payload: string }
  | { type: "TICK" }
  | { type: "FINISH_GAME" }
  | { type: "RESTART"; payload: string }
  | { type: "SET_SELECTED_TIME"; payload: number };

const initialState: GameType = {
  text: "",
  selectedMode: Mode.SENTENCE,
  wordsArray: [],
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const reducer = (state: GameType, action: Action): GameType => {
    switch (action.type) {
      case "GENERATE_TEXT": {
        return {
          ...state,
          text: action.payload.text,
          wordsArray: action.payload.text
            .split(" ")
            .map((word) => [...word, " "]),
          selectedMode: action.payload.mode,
          input: "",
          wordIndex: 0,
          charIndex: 0,
          wordsTyped: 0,
          isTyping: false,
          cursorIndex: 0,
          finished: false,
          mistakes: 0,
          wpm: 0,
          timeLeft: state.selectedTime,
        };
      }

      case "INPUT_CHANGED": {
        const currentInput = action.payload;
        const currentWord = state.wordsArray[state.wordIndex];
        const currentWordLength = currentWord.length;

        const newState = { ...state, input: currentInput };

        if (!newState.isTyping) {
          newState.isTyping = true;
        }

        // backspace case
        if (currentInput.length < state.input.length) {
          const expectedInput = currentWord
            .slice(0, state.charIndex - 1)
            .join("");
          // if backspaced char was correctly typed
          if (currentInput === expectedInput) {
            newState.charIndex = state.charIndex - 1;
            newState.cursorIndex = state.cursorIndex - 1;
          }
        } else {
          // user's inputed char
          const currentChar = currentInput[state.charIndex];
          // char from the text
          const correctChar = currentWord[state.charIndex];

          // if user's char === char from the text
          if (currentChar === correctChar) {
            // end of the word case
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

            // end of the text case
            if (
              state.wordIndex === state.wordsArray.length - 1 &&
              currentInput.length === currentWordLength - 1
            ) {
              const elapsedTime = newState.selectedTime - newState.timeLeft;
              const finalWPM = Math.floor(
                (newState.wordsTyped + 1) / (elapsedTime / 60)
              );
              return {
                ...newState,
                input: "",
                wordIndex: state.wordsArray.length,
                finished: true,
                isTyping: false,
                wpm: finalWPM,
                wordsTyped: newState.wordsTyped + 1,
              };
            }

            // mistake case
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
        const newText = getRandomSentence();
        return {
          ...initialState,
          selectedMode: state.selectedMode,
          selectedTime: state.selectedTime,
          timeLeft: state.selectedTime,
          text: newText,
          wordsArray: newText.split(" ").map((word) => [...word, " "]),
        };

      case "SET_SELECTED_TIME":
        return {
          ...state,
          text: state.text,
          selectedMode: state.selectedMode,
          selectedTime: action.payload,
          timeLeft: action.payload,
          input: "",
          wordIndex: 0,
          charIndex: 0,
          wordsTyped: 0,
          isTyping: false,
          cursorIndex: 0,
          finished: false,
          mistakes: 0,
          wpm: 0,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const newText = getRandomSentence();
    dispatch({
      type: "GENERATE_TEXT",
      payload: { mode: Mode.SENTENCE, text: newText },
    });
  }, []);

  const typedCharacters = useMemo(
    () =>
      state.wordsArray.slice(0, state.wordIndex).flat().length +
      state.charIndex,
    [state.charIndex, state.wordIndex, state.wordsArray]
  );

  const totalCharacters = useMemo(
    () =>
      state.wordsArray.flat().length - (state.wordsArray.length > 0 ? 1 : 0),
    [state.wordsArray]
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
          await api.post("/users/stats", {
            wpm: state.wpm,
            accuracy: accuracy,
            selectedTime: state.selectedTime,
            progress: progress,
            selectedMode: state.selectedMode,
          });
        } catch (error) {
          console.error("Failed to submit stats:", error);
        }
      };
      sendStats();
    }
  }, [
    accuracy,
    progress,
    state.finished,
    state.selectedMode,
    state.selectedTime,
    state.wpm,
  ]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "INPUT_CHANGED", payload: e.target.value });
  }, []);

  const handleTimeSelect = useCallback((time: number) => {
    dispatch({ type: "SET_SELECTED_TIME", payload: time });
  }, []);

  const handleModeSelect = useCallback(async (mode: Mode) => {
    let newText = "";
    try {
      setLoading(true);
      if (mode === Mode.SENTENCE) {
        newText = getRandomSentence();
      } else if (mode === Mode.QUOTE) {
        const response = await getRandomQuote();
        newText = response.quote;
      } else if (mode === Mode.WORDS) {
        const response = await getRandomWords();
        newText = response.join(" ");
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }

    dispatch({ type: "GENERATE_TEXT", payload: { mode, text: newText } });
  }, []);

  return (
    <div className="flex flex-col justify-center gap-7 rounded-lg font-roboto">
      <div className="flex text-[#D1D0C5] flex-col gap-24 py-6">
        <Statistics
          isTyping={state.isTyping}
          finished={state.finished}
          seconds={state.timeLeft}
          wpm={state.wpm}
          onTimeSelect={handleTimeSelect}
          accuracy={accuracy}
          selectedMode={state.selectedMode}
          onModeSelect={handleModeSelect}
        />

        <ProgressBar progress={progress} />

        <Text
          splitted={state.wordsArray}
          isTyping={state.isTyping}
          finished={state.finished}
          cursorIndex={state.cursorIndex}
          loading={loading}
          error={error}
        />

        <Input
          input={state.input}
          handleChange={handleChange}
          finished={state.finished}
          restart={handleModeSelect}
          selectedMode={state.selectedMode}
        />
      </div>
    </div>
  );
}
