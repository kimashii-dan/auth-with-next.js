"use client";
import {
  useEffect,
  useCallback,
  ChangeEvent,
  useMemo,
  useReducer,
  useState,
} from "react";
import axios from "axios";
import Statistics from "@/components/Statistics";
import ProgressBar from "@/components/ProgressBar";
import Text from "@/components/Text";
import Input from "@/components/Input";
import GameType from "@/types/GameType";

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This classic pangram contains every letter of the English alphabet at least once.",
  "Programming is the art of telling another human what one wants the computer to do. Elegant code speaks volumes in few words.",
  "Practice makes perfect. Consistent typing practice improves speed and accuracy over time. Keep challenging yourself daily.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Touch typing is a method of typing without looking at the keyboard. It increases productivity and reduces errors significantly.",
  "In a world full of shortcuts, proper typing skills remain fundamental. Invest time in learning correct techniques for long-term benefits.",
  "Coding marathons require both speed and endurance. Efficient typing helps developers maintain flow state and productivity for hours.",
  "Accuracy matters as much as speed. Rushing through text with many errors defeats the purpose of effective communication.",
];
type Action =
  // | { type: "GENERATE_TEXT"; payload: string }
  | { type: "INPUT_CHANGED"; payload: string }
  | { type: "TICK" }
  | { type: "FINISH_GAME" }
  | { type: "RESTART" }
  | { type: "SET_SELECTED_TIME"; payload: number };

const initialState: GameType = {
  text: "",
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
  const [text, setText] = useState<string>("");

  const getRandomText = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    setText(sampleTexts[randomIndex]);
  }, []);

  useEffect(() => {
    getRandomText();
  }, [getRandomText]);

  const wordsArray = useMemo(
    () => text.split(" ").map((word) => [...word, " "]),
    [text]
  );

  const reducer = (state: GameType, action: Action): GameType => {
    switch (action.type) {
      // case "GENERATE_TEXT":
      //   return { ...state, text: action.payload };
      case "INPUT_CHANGED": {
        const currentInput = action.payload;
        const currentWord = wordsArray[state.wordIndex];
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

  const totalCharacters = useMemo(
    () => wordsArray.flat().length - (wordsArray.length > 0 ? 1 : 0),
    [wordsArray]
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
          await axios.post("/api/users/stats", {
            wpm: state.wpm,
            accuracy: accuracy,
            selectedTime: state.selectedTime,
            progress: progress,
          });
        } catch (error) {
          console.error("Failed to submit stats:", error);
        }
      };
      sendStats();
    }
  }, [accuracy, progress, state.finished, state.selectedTime, state.wpm]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "INPUT_CHANGED", payload: e.target.value });
  }, []);

  const handleTimeSelect = useCallback((time: number) => {
    dispatch({ type: "SET_SELECTED_TIME", payload: time });
  }, []);

  const restart = useCallback(() => {
    dispatch({ type: "RESTART" });
    getRandomText();
  }, [getRandomText]);

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
