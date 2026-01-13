import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '13.51.158.214',
  withCredentials: true,
})

export async function fetchCurrentUser() {
  const res = await api.get('/auth/me')
  return res.data?.data
}


