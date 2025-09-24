import axios from "axios";

const baseURL = `http://localhost:3000`

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

export default api;