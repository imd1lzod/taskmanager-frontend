import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api'
import toast from 'react-hot-toast'

type Priority = 'low' | 'medium' | 'high'
type Status = 'todo' | 'in-progress' | 'done'

const mapPriorityToApi = (p: Priority): 'Low' | 'Medium' | 'High' => ({ low: 'Low', medium: 'Medium', high: 'High' }[p])
const mapPriorityFromApi = (p: 'Low' | 'Medium' | 'High'): Priority => ({ Low: 'low', Medium: 'medium', High: 'high' }[p])
const mapStatusToApi = (s: Status): 'Todo' | 'InProgress' | 'Done' => ({ 'todo': 'Todo', 'in-progress': 'InProgress', 'done': 'Done' }[s])
const mapStatusFromApi = (s: 'Todo' | 'InProgress' | 'Done'): Status => ({ 'Todo': 'todo', 'InProgress': 'in-progress', 'Done': 'done' }[s])

export function useTasks(params?: {
  search?: string
  status?: Status
  priority?: Priority
  categoryId?: number
  from?: string
  to?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: async () => {
      const { data } = await api.get('/tasks', { params: {
        ...params,
        status: params?.status ? mapStatusToApi(params.status) : undefined,
        priority: params?.priority ? mapPriorityToApi(params.priority) : undefined,
      }})
      const items = (data.items ?? data).map((t: any) => ({
        id: String(t.id),
        title: t.title,
        description: t.description,
        status: mapStatusFromApi(t.status),
        priority: mapPriorityFromApi(t.priority),
        tags: [],
        assignedUserId: undefined,
        dueDate: t.date ? new Date(t.date).toISOString() : undefined,
        boardId: 'api',
        createdAt: t.date ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))
      return { items, meta: data.meta }
    },
  })
}

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { title: string; description: string; priority: Priority; status?: Status; categoryId?: number; date?: string }) => {
      try {
        const { data } = await api.post('/tasks', {
          ...payload,
          priority: mapPriorityToApi(payload.priority),
          status: payload.status ? mapStatusToApi(payload.status) : undefined,
        })
        return data
      } catch (error: any) {
        if (error?.response?.status === 403) {
          toast.error("Vazifa yaratish uchun ro'yxatdan o'ting yoki tizimga kiring")
        } else {
          const message = error?.response?.data?.message || 'Vazifa yaratishda xatolik yuz berdi'
          toast.error(Array.isArray(message) ? message[0] : message)
        }
        throw error
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: number; title?: string; description?: string; priority?: Priority; status?: Status; categoryId?: number; date?: string }) => {
      const { data } = await api.patch(`/tasks/${id}`, {
        ...payload,
        priority: payload.priority ? mapPriorityToApi(payload.priority) : undefined,
        status: payload.status ? mapStatusToApi(payload.status) : undefined,
      })
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/tasks/${id}`)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })
}


