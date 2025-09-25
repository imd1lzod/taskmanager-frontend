import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task } from '../../types'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { formatDate } from '../../lib/utils'
import { Calendar } from 'lucide-react'
import TaskModal from './TaskModal'

interface TaskCardProps {
  task: Task
  isDragging?: boolean
}

export default function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getPriorityColor = (priority: string) => {
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
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className={`task-card cursor-pointer border border-gray-200 rounded-lg hover:shadow-md transition-shadow ${
          isDragging || isSortableDragging ? 'dragging' : ''
        }`}
        onClick={() => setIsModalOpen(true)}
        {...attributes}
        {...listeners}
      >
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-3">
            {/* Title */}
            <h3 className="font-medium text-sm sm:text-base leading-tight text-gray-900">{task.title}</h3>
            
            {/* Description */}
            {task.description && (
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {task.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{task.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center space-x-2">
                {/* Priority */}
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>

                {/* Dates */}
                {task.allDay ? (
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" /> All day
                  </div>
                ) : task.startDate || task.endDate || task.dueDate ? (
                  <div className={`flex items-center text-xs ${
                    isOverdue ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(task.startDate || task.dueDate!)}
                    {task.endDate && ` - ${formatDate(task.endDate)}`}
                  </div>
                ) : null}

                {/* Overdue/Incomplete */}
                {isIncomplete && (
                  <Badge className="bg-red-100 text-red-800">Bajarilmagan</Badge>
                )}
              </div>

              {/* Assigned User */}
              {task.assignedUser && (
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {task.assignedUser.initials}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Modal */}
      <TaskModal
        task={task}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  )
}
