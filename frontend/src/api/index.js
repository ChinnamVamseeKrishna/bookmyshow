import axios from "axios";

const isProduction = process.env.REACT_APP_PROD === "production";

export const axiosInstance = axios.create({
  baseURL: isProduction
    ? "https://bookmyshow-c0q5.onrender.com/"
    : "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
