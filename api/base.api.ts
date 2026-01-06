import axios from "axios";

const baseURL = `http://51.20.108.115:3000`

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

export default api;
