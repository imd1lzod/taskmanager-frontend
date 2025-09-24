import api from "../base.api";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export async function register(payload: RegisterPayload) {
  const res = await api.post(`/auth/register`, payload);
  return res.data;
}