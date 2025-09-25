import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppSelector } from '../../hooks/redux'
import { useCreateTask } from '../../hooks/tasks'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { CreateTaskData, TaskPriority, TaskStatus } from '../../types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Calendar, Upload, X } from 'lucide-react'

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  boardId?: string
}

export default function CreateTaskDialog({ open, onOpenChange, boardId = '1' }: CreateTaskDialogProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority>('medium')
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>('todo')
  const [selectedStart, setSelectedStart] = useState('')
  const [selectedEnd, setSelectedEnd] = useState('')
  const [allDay, setAllDay] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const createTaskMutation = useCreateTask()
  const isLoading = createTaskMutation.isPending

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTaskData>({
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      tags: [],
      status: 'todo',
      boardId,
    },
  })

  useEffect(() => {
    if (open && !isAuthenticated) {
      onOpenChange(false)
      window.location.href = '/login'
    }
  }, [open, isAuthenticated, onOpenChange])

  const onSubmit = async (data: CreateTaskData) => {
    try {
      if (!isAuthenticated) {
        onOpenChange(false)
        window.location.href = '/login'
        return
      }
      await createTaskMutation.mutateAsync({
        title: data.title,
        description: data.description,
        priority: selectedPriority,
        status: selectedStatus,
        // API expects a single date field; map to 'date'
        date: (selectedStart || selectedEnd) || undefined,
        // Optional extras not in API are ignored by hook typing
      })
      onOpenChange(false)
      reset()
      setSelectedPriority('medium')
      setSelectedStatus('todo')
      setSelectedStart('')
      setSelectedEnd('')
      setAllDay(false)
      setUploadedFile(null)
    } catch (error) {
      // Error is handled by Redux
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-blue-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold">Yangi vazifa qo'shish</DialogTitle>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            Ortga qaytish
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Title and Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">Sarlavha</Label>
              <Input
                id="title"
                placeholder="Vazifa sarlavhasini kiriting"
                {...register('title', { required: 'Sarlavha kiritilishi shart' })}
                className="h-12"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="start" className="text-sm font-medium">Boshlanish</Label>
              <div className="relative">
                <Input
                  id="start"
                  type="datetime-local"
                  value={selectedStart}
                  onChange={(e) => setSelectedStart(e.target.value)}
                  className="h-12 pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end" className="text-sm font-medium">Tugash</Label>
              <div className="relative">
                <Input
                  id="end"
                  type="datetime-local"
                  value={selectedEnd}
                  onChange={(e) => setSelectedEnd(e.target.value)}
                  className="h-12 pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Priority Section */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Muhimlik</Label>
            <div className="flex space-x-6">
              {(['high', 'medium', 'low'] as TaskPriority[]).map((priority) => (
                <label key={priority} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value={priority}
                    checked={selectedPriority === priority}
                    onChange={(e) => setSelectedPriority(e.target.value as TaskPriority)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedPriority === priority 
                      ? `border-${getPriorityColor(priority).split('-')[1]}-500` 
                      : 'border-gray-300'
                  }`}>
                    {selectedPriority === priority && (
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(priority)} m-0.5`}></div>
                    )}
                  </div>
                  <span className="text-sm font-medium capitalize">{priority === 'high' ? 'Yuqori' : priority === 'medium' ? "O'rta" : 'Past'}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Section */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">Holat</Label>
            <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as TaskStatus)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Holatni tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">Bajarilishi kerak</SelectItem>
                <SelectItem value="in-progress">Jarayonda</SelectItem>
                <SelectItem value="done">Bajarilgan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Task Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Vazifa tavsifi</Label>
            <Textarea
              id="description"
              rows={6}
              placeholder="Bu yerga yozishni boshlang..."
              {...register('description')}
              className="resize-none"
            />
          </div>

          {/* All Day */}
          <div className="flex items-center space-x-2">
            <input id="allDay" type="checkbox" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} />
            <Label htmlFor="allDay" className="text-sm font-medium">Kunni butunlay egallaydi (All day)</Label>
          </div>

          {/* Upload Image Section */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Rasm yuklash</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Fayllarni olib kirib tashlang yoki</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="px-6"
                  >
                    Tanlash
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                {uploadedFile && (
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-sm text-gray-600">{uploadedFile.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setUploadedFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Done Button */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-3 text-lg font-medium"
            >
              {isLoading ? 'Yaratilmoqda...' : 'Yaratish'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
