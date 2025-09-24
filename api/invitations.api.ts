import api from "./base.api";

export type InvitationDTO = {
  id: number;
  email: string;
  token: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
  createdAt: string;
  expiresAt: string;
}

export async function listInvitations() {
  const res = await api.get(`/invitations`)
  return res.data.data as InvitationDTO[]
}

export async function sendInvitation(email: string) {
  const res = await api.post(`/invitations`, { email })
  return res.data
}

export async function validateInvitation(token: string) {
  const res = await api.get(`/invitations/${token}`)
  return res.data
}

export async function acceptInvitation(token: string, user: { name: string; password: string; avatar?: string }) {
  const res = await api.post(`/invitations/accept`, { token, ...user })
  return res.data
}


