import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
})

export async function fetchCurrentUser() {
  const res = await api.get('/auth/me')
  return res.data?.data
}


