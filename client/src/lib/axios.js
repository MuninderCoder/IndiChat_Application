import axios from "axios";

// In development, Vite proxies /api → http://localhost:5001/api (see vite.config.js).
// Using a relative base URL here makes the proxy work automatically.
// In production (Vercel/Render), VITE_API_URL must be set to the full backend URL.

const API_URL = import.meta.env.VITE_API_URL || "";
const cleanApiUrl = API_URL.endsWith("/api") ? API_URL : `${API_URL}/api`;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? "/api"           // relative → routed through Vite proxy to localhost:5001/api
    : cleanApiUrl,     // absolute production URL from VITE_API_URL env var
  withCredentials: true,
});
