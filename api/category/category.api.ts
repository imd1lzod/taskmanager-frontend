import api from "../base.api";

export async function getAllCategories(params?: {
  search?: string
  priority?: 'Low' | 'Medium' | 'High'
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) {
  const res = await api.get(`/categories`, { params })
  return res.data
}

export async function getCategoryById(id: number) {
  const res = await api.get(`/categories/${id}`)
  return res.data
}



