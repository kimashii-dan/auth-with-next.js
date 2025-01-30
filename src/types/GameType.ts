interface GameType {
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
