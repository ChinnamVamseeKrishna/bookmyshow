import axios from "axios";
const isProduction = process?.env?.NODE_ENV === "production";

export const axiosInstance = axios.create({
  baseURL: isProduction
    ? "https://bookmyshow-c0q5.onrender.com/"
    : "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
