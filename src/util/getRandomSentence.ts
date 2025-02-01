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

export const getRandomSentence = () => {
  const randomIndex = Math.floor(Math.random() * sampleTexts.length);
  return sampleTexts[randomIndex];
};
