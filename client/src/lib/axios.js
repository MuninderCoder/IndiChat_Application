import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "";
const cleanApiUrl = API_URL.endsWith("/api") ? API_URL : `${API_URL}/api`;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:5001/api"
    : cleanApiUrl,
  withCredentials: true,
});

