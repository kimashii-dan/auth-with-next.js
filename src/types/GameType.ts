import { Mode } from "@/enums/Mode";

interface GameType {
  text: string;
  selectedMode: Mode;
  wordsArray: string[][];
  input: string;
  wordIndex: number;
  charIndex: number;
  wordsTyped: number;
  isTyping: boolean;
  timeLeft: number;
  selectedTime: number;
  wpm: number;
  cursorIndex: number;
  finished: boolean;
  mistakes: number;
}

export default GameType;
