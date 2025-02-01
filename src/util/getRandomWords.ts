import axios from "axios";
export const getRandomWords = async () => {
  try {
    const randomNumber = Math.floor(Math.random() * (25 - 15 + 1)) + 15;

    const response = await axios.get(
      `https://random-word-api.herokuapp.com/word?number=${randomNumber}`
    );
    const words = response.data;
    return words;
  } catch (error) {
    console.log(error);
  }
};
