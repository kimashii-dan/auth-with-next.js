import axios from "axios";
export const getRandomQuote = async () => {
  try {
    const response = await axios.get("https://dummyjson.com/quotes/random");
    const quote = response.data;
    return quote;
  } catch (error) {
    console.log(error);
  }
};
