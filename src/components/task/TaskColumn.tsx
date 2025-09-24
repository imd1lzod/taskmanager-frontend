import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Task, TaskStatus } from '../../types'
import TaskCard from './TaskCard'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'

interface TaskColumnProps {
  title: string
  status: TaskStatus
  tasks: Task[]
}

export default function TaskColumn({ title, status, tasks }: TaskColumnProps) {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'done':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="h-fit min-w-[18rem] sm:min-w-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge className={getStatusColor(status)}>
            {tasks.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No tasks yet
              </div>
            )}
          </div>
        </SortableContext>
      </CardContent>
    </Card>
  )
}
