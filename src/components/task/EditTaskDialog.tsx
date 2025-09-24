import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { updateTask } from '../../store/slices/taskSlice'
import { TaskPriority, TaskStatus } from '../../types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Badge } from '../ui/badge'
import { Edit, Save, Calendar, Upload, X, ArrowLeft } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  dueDate?: string
  startDate?: string
  endDate?: string
  allDay?: boolean
  image?: string
  tags?: string[]
}

interface EditTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
}

export default function EditTaskDialog({ open, onOpenChange, task }: EditTaskDialogProps) {
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority>('medium')
  const [selectedStart, setSelectedStart] = useState('')
  const [selectedEnd, setSelectedEnd] = useState('')
  const [allDay, setAllDay] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state) => state.tasks)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      tags: [],
      status: 'todo',
    },
  })

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      setValue('title', task.title)
      setValue('description', task.description)
      setValue('priority', task.priority)
      setValue('status', task.status)
      setSelectedPriority(task.priority)
      setSelectedStart(task.startDate || '')
      setSelectedEnd(task.endDate || '')
      setAllDay(!!task.allDay)
    }
  }, [task, setValue])

  const onSubmit = async (data: any) => {
    if (!task) return
    
    try {
      await dispatch(updateTask({ 
        id: task.id, 
        ...data, 
        priority: selectedPriority,
        startDate: selectedStart || undefined,
        endDate: selectedEnd || undefined,
        allDay
      })).unwrap()
      onOpenChange(false)
      reset()
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

  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return 'Extreme'
      case 'medium':
        return 'Moderate'
      case 'low':
        return 'Low'
      default:
        return priority
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-8 bg-red-500 rounded-full"></div>
            <DialogTitle className="text-2xl font-bold">Edit Task</DialogTitle>
          </div>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            Go Back
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Title and Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">Title</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                {...register('title', { required: 'Title is required' })}
                className="h-12"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="start" className="text-sm font-medium">Start</Label>
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
              <Label htmlFor="end" className="text-sm font-medium">End</Label>
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
            <Label className="text-sm font-medium">Priority</Label>
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
                  <span className="text-sm font-medium">{getPriorityLabel(priority)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* All Day */}
          <div className="flex items-center space-x-2">
            <input id="allDay" type="checkbox" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} />
            <Label htmlFor="allDay" className="text-sm font-medium">All day</Label>
          </div>

          {/* Task Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Task Description</Label>
            <Textarea
              id="description"
              rows={6}
              placeholder="Start writing here....."
              {...register('description')}
              className="resize-none"
            />
          </div>

          {/* Upload Image Section */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Upload Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Drag&Drop files here or</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="px-6"
                  >
                    Browse
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
              {isLoading ? 'Updating...' : 'Done'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
