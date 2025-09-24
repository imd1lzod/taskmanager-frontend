import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api'
import toast from 'react-hot-toast'

type Priority = 'low' | 'medium' | 'high'
const mapPriorityToApi = (p?: Priority) => p ? ({ low: 'Low', medium: 'Medium', high: 'High' }[p]) : undefined

export function useCategories(params?: {
  search?: string
  priority?: Priority
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: async () => {
      const { data } = await api.get('/categories', { params: { ...params, priority: mapPriorityToApi(params?.priority) } })
      return data
    },
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { name: string; description: string; priority: Priority }) => {
      try {
        const { data } = await api.post('/categories', { ...payload, priority: mapPriorityToApi(payload.priority) })
        return data
      } catch (error: any) {
        if (error?.response?.status === 403) {
          toast.error("Kategoriya yaratish uchun ro'yxatdan o'ting yoki tizimga kiring")
        } else {
          const message = error?.response?.data?.message || 'Kategoriya yaratishda xatolik yuz berdi'
          toast.error(Array.isArray(message) ? message[0] : message)
        }
        throw error
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: number; name?: string; description?: string; priority?: Priority }) => {
      const { data } = await api.patch(`/categories/${id}`, { ...payload, priority: mapPriorityToApi(payload.priority) })
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/categories/${id}`)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}


