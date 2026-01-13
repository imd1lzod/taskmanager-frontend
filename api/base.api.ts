import axios from "axios";

<<<<<<< HEAD
const baseURL = `13.51.158.214`
=======
const baseURL = `http://51.20.108.115:3000`
>>>>>>> 8dc80889a3b900e6afd5bd9d0119db704214f03d

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

export default api;
