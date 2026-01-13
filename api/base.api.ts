import axios from "axios";

const baseURL = `13.51.158.214`

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

export default api;