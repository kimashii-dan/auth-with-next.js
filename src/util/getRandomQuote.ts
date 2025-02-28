import axios from "axios";
export const getRandomQuote = async () => {
  const response = await axios.get("https://dummyjson.com/quotes/random");
  const quote = response.data;
  return quote;
};
