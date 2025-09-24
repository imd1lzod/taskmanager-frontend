import axios from "axios";

const baseURL = `http://13.62.99.86:3000`

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

export default api;