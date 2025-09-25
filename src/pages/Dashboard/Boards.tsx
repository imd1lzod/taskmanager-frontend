import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { createBoard, deleteBoard } from '../../store/slices/boardSlice'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
import { useForm } from 'react-hook-form'
import { Plus, MoreVertical, Trash2, Edit, Calendar } from 'lucide-react'
import { formatDate } from '../../lib/utils'
import { CreateBoardData } from '../../types'

const boardColors = [
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Green', value: 'bg-green-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Red', value: 'bg-red-500' },
  { name: 'Yellow', value: 'bg-yellow-500' },
  { name: 'Pink', value: 'bg-pink-500' },
  { name: 'Indigo', value: 'bg-indigo-500' },
  { name: 'Gray', value: 'bg-gray-500' },
]

export default function Boards() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState('bg-blue-500')
  const { boards, isLoading } = useAppSelector((state) => state.boards)
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBoardData>()

  const onSubmit = async (data: CreateBoardData) => {
    try {
      await dispatch(createBoard({ ...data, color: selectedColor })).unwrap()
      setIsCreateDialogOpen(false)
      reset()
    } catch (error) {
      // Error is handled by Redux
    }
  }

  const handleDeleteBoard = async (boardId: string) => {
    if (window.confirm('Are you sure you want to delete this board?')) {
      try {
        await dispatch(deleteBoard(boardId)).unwrap()
      } catch (error) {
        // Error is handled by Redux
      }
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Loyihalar</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Loyiha doskalarini va vazifalarni boshqaring
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="mr-2 h-4 w-4" />
              Yangi Loyiha
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] sm:w-auto">
            <DialogHeader>
              <DialogTitle>Yangi Loyiha Yaratish</DialogTitle>
              <DialogDescription>
                Vazifalaringiz va loyihalaringizni tashkil etish uchun yangi doska yarating.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Loyiha Sarlavhasi</Label>
                <Input
                  id="title"
                  placeholder="Loyiha sarlavhasini kiriting"
                  {...register('title', {
                    required: 'Sarlavha kiritilishi shart',
                    minLength: {
                      value: 2,
                      message: 'Sarlavha kamida 2 ta belgidan iborat bo\'lishi kerak',
                    },
                  })}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Tavsif</Label>
                <Input
                  id="description"
                  placeholder="Loyiha tavsifini kiriting"
                  {...register('description', {
                    required: 'Tavsif kiritilishi shart',
                  })}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Loyiha Rangi</Label>
                <div className="grid grid-cols-4 gap-2">
                  {boardColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`w-8 h-8 rounded-md ${color.value} ${
                        selectedColor === color.value
                          ? 'ring-2 ring-offset-2 ring-primary'
                          : ''
                      }`}
                      onClick={() => setSelectedColor(color.value)}
                    />
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Bekor qilish
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Yaratilmoqda...' : 'Loyiha Yaratish'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Boards Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading boards...</div>
        </div>
      ) : boards.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            Loyihalar topilmadi. Boshlash uchun birinchi loyihangizni yarating.
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Loyiha Yaratish
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boards.map((board) => (
            <Card key={board.id} className="board-card group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-lg ${board.color} flex items-center justify-center mb-3`}>
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteBoard(board.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-lg">{board.title}</CardTitle>
                <CardDescription className="text-sm">
                  {board.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  Yaratilgan {formatDate(board.createdAt)}
                </div>
                <Button
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  variant="outline"
                  onClick={() => window.location.href = `/board/${board.id}`}
                >
                  Loyihani Ochish
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
