import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
// Removed unused SortableContext import
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { fetchBoardById } from '../../store/slices/boardSlice'
// import { moveTask } from '../../store/slices/taskSlice'
import { useTasks } from '../../hooks/tasks'
import { Button } from '../../components/ui/button'
// Removed unused Card imports
import { ArrowLeft, Plus, MoreVertical } from 'lucide-react'
import TaskColumn from '../../components/task/TaskColumn'
import TaskCard from '../../components/task/TaskCard'
import CreateTaskDialog from '../../components/task/CreateTaskDialog'
import { Task, TaskStatus } from '../../types'

const columns = [
  { id: 'todo', title: 'To Do', status: 'todo' as TaskStatus },
  { id: 'in-progress', title: 'In Progress', status: 'in-progress' as TaskStatus },
  { id: 'done', title: 'Done', status: 'done' as TaskStatus },
]

export default function BoardPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentBoard, isLoading: boardLoading } = useAppSelector((state) => state.boards)
  const { data: taskData } = useTasks()
  const apiTasks = (taskData?.items ?? []) as Task[]
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  useEffect(() => {
    if (id) {
      dispatch(fetchBoardById(id))
    }
  }, [dispatch, id])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = apiTasks.find((t) => t.id === active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event
    setActiveTask(null)

    if (!over) return

    // DnD move disabled for backend-driven list (persist via API in future)
    return
  }

  const getTasksByStatus = (status: TaskStatus) => {
    return apiTasks.filter((task) => task.status === status)
  }

  if (boardLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading board...</div>
      </div>
    )
  }

  if (!currentBoard) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">Board not found</div>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Boards
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {currentBoard.title}
            </h1>
            <p className="text-muted-foreground">
              {currentBoard.description}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsCreateTaskOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
          <Button variant="outline" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Board Content */}
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="md:grid md:grid-cols-3 gap-6 flex md:flex-none overflow-x-auto md:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none] [-webkit-overflow-scrolling:touch] md:[-webkit-overflow-scrolling:auto] [&::-webkit-scrollbar]:hidden">
          {columns.map((column) => (
            <TaskColumn
              key={column.id}
              title={column.title}
              status={column.status}
              tasks={getTasksByStatus(column.status)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={isCreateTaskOpen}
        onOpenChange={setIsCreateTaskOpen}
        boardId={currentBoard.id}
      />
    </div>
  )
}
