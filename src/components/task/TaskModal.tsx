import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { updateTask, deleteTask } from '../../store/slices/taskSlice'
import { Task, UpdateTaskData, TaskPriority } from '../../types'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Badge } from '../ui/badge'
// Avatar imports removed (unused)
import { formatDateTime } from '../../lib/utils'
import { Calendar, Clock, Trash2, Save } from 'lucide-react'

interface TaskModalProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function TaskModal({ task, open, onOpenChange }: TaskModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newTag, setNewTag] = useState('')
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state) => state.tasks)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateTaskData>({
    defaultValues: {
      title: task.title,
      description: task.description,
      priority: task.priority,
      tags: task.tags,
      assignedUserId: task.assignedUserId,
      startDate: task.startDate ? task.startDate.slice(0,16) : '',
      endDate: task.endDate ? task.endDate.slice(0,16) : '',
      allDay: task.allDay,
      status: task.status,
    },
  })

  const watchedTags = watch('tags', task.tags)
  const watchedPriority = watch('priority', task.priority)

  const onSubmit = async (data: UpdateTaskData) => {
    try {
      const { id: _ignored, ...rest } = (data as any) || {}
      await dispatch(updateTask({ id: task.id, ...rest })).unwrap()
      setIsEditing(false)
    } catch (error) {
      // Error is handled by Redux
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(task.id)).unwrap()
        onOpenChange(false)
      } catch (error) {
        // Error is handled by Redux
      }
    }
  }

  const addTag = () => {
    const current = watchedTags ?? []
    if (newTag.trim() && !current.includes(newTag.trim())) {
      setValue('tags', [...current, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    const current = watchedTags ?? []
    setValue('tags', current.filter(tag => tag !== tagToRemove))
  }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isOverdue = (task.endDate || task.dueDate) && new Date(task.endDate || task.dueDate!) < new Date()
  const isIncomplete = isOverdue && task.status !== 'done'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{isEditing ? 'Edit Task' : 'Task Details'}</span>
            {isIncomplete && (
              <Badge className="bg-red-100 text-red-800">Bajarilmagan</Badge>
            )}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the task details below' : 'View and manage task information'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              {isEditing ? (
                <Input
                  id="title"
                  {...register('title', { required: 'Title is required' })}
                />
              ) : (
                <p className="text-sm font-medium">{task.title}</p>
              )}
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              {isEditing ? (
                <Select
                  value={watchedPriority}
                  onValueChange={(value) => setValue('priority', value as TaskPriority)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            {isEditing ? (
              <Textarea
                id="description"
                rows={4}
                {...register('description')}
                placeholder="Enter task description"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {task.description || 'No description provided'}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(watchedTags ?? []).map((tag, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {task.tags.length > 0 ? (
                  task.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No tags</p>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* All Day */}
            <div className="space-y-2">
              <Label htmlFor="allDay">All day</Label>
              {isEditing ? (
                <input id="allDay" type="checkbox" {...register('allDay')} />
              ) : (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {task.allDay ? 'All day' : 'Timed'}
                </div>
              )}
            </div>

            {/* Start */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Start</Label>
              {isEditing ? (
                <Input id="startDate" type="datetime-local" {...register('startDate')} />
              ) : (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {task.startDate ? (
                    <span className="text-muted-foreground">{formatDateTime(task.startDate)}</span>
                  ) : (
                    <span className="text-muted-foreground">No start</span>
                  )}
                </div>
              )}
            </div>

            {/* End */}
            <div className="space-y-2">
              <Label htmlFor="endDate">End</Label>
              {isEditing ? (
                <Input id="endDate" type="datetime-local" {...register('endDate')} />
              ) : (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {task.endDate ? (
                    <span className="text-muted-foreground">{formatDateTime(task.endDate)}</span>
                  ) : (
                    <span className="text-muted-foreground">No end</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            {isEditing ? (
              <Select
                value={task.status}
                onValueChange={(value) => setValue('status', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge className="bg-blue-100 text-blue-800">
                {task.status.replace('-', ' ').toUpperCase()}
              </Badge>
            )}
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Created {formatDateTime(task.createdAt)}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Updated {formatDateTime(task.updatedAt)}
              </div>
            </div>
          </div>

          {isEditing && (
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  reset()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
