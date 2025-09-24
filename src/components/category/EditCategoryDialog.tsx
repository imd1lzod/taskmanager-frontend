import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useUpdateCategory } from '../../hooks/categories'
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
import { Edit, Save, Palette, X } from 'lucide-react'

interface Category {
  id: string
  name: string
  description: string
  color: string
  priority: 'high' | 'medium' | 'low'
  taskCount: number
  completedCount: number
}

interface EditCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
}

const colorOptions = [
  { name: 'Qizil', value: 'red', class: 'bg-red-500' },
  { name: 'Ko\'k', value: 'blue', class: 'bg-blue-500' },
  { name: 'Yashil', value: 'green', class: 'bg-green-500' },
  { name: 'Sariq', value: 'yellow', class: 'bg-yellow-500' },
  { name: 'Binafsha', value: 'purple', class: 'bg-purple-500' },
  { name: 'Pink', value: 'pink', class: 'bg-pink-500' },
  { name: 'Indigo', value: 'indigo', class: 'bg-indigo-500' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
]

const priorityOptions = [
  { name: 'Yuqori', value: 'high', color: 'text-red-600' },
  { name: 'O\'rta', value: 'medium', color: 'text-blue-600' },
  { name: 'Past', value: 'low', color: 'text-green-600' },
]

export default function EditCategoryDialog({ open, onOpenChange, category }: EditCategoryDialogProps) {
  const [selectedColor, setSelectedColor] = useState('blue')
  const [selectedPriority, setSelectedPriority] = useState<'high' | 'medium' | 'low'>('medium')
  const updateCategory = useUpdateCategory()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      color: 'blue',
      priority: 'medium',
    },
  })

  // Reset form when category changes
  useEffect(() => {
    if (category) {
      setValue('name', category.name)
      setValue('description', category.description)
      setValue('color', category.color)
      setValue('priority', category.priority)
      setSelectedColor(category.color)
      setSelectedPriority(category.priority)
    }
  }, [category, setValue])

  const onSubmit = async (data: any) => {
    if (!category) return
    
    try {
      await updateCategory.mutateAsync({ id: Number(category.id), name: data.name, description: data.description, priority: selectedPriority })
      onOpenChange(false)
      reset()
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
            <DialogTitle className="text-2xl font-bold">Kategoriyani Tahrirlash</DialogTitle>
          </div>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Kategoriya Nomi</Label>
            <Input
              id="name"
              placeholder="Kategoriya nomini kiriting"
              {...register('name', { required: 'Kategoriya nomi kiritilishi shart' })}
              className="h-12"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Category Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Tavsif</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Kategoriya haqida qisqacha ma'lumot..."
              {...register('description')}
              className="resize-none"
            />
          </div>

          {/* Color Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Rang</Label>
            <div className="grid grid-cols-4 gap-3">
              {colorOptions.map((color) => (
                <label key={color.value} className="flex flex-col items-center space-y-2 cursor-pointer">
                  <input
                    type="radio"
                    name="color"
                    value={color.value}
                    checked={selectedColor === color.value}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-12 h-12 rounded-lg ${color.class} border-2 ${
                    selectedColor === color.value ? 'border-gray-800' : 'border-gray-300'
                  } hover:border-gray-500 transition-colors`}></div>
                  <span className="text-xs text-gray-600">{color.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Priority Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Muhimlik</Label>
            <div className="flex space-x-6">
              {priorityOptions.map((priority) => (
                <label key={priority.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value={priority.value}
                    checked={selectedPriority === priority.value}
                    onChange={(e) => setSelectedPriority(e.target.value as 'high' | 'medium' | 'low')}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedPriority === priority.value 
                      ? `border-${getPriorityColor(priority.value).split('-')[1]}-500` 
                      : 'border-gray-300'
                  }`}>
                    {selectedPriority === priority.value && (
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(priority.value)} m-0.5`}></div>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${priority.color}`}>{priority.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category Stats Preview */}
          {category && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-gray-900">Kategoriya Statistikasi</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Jami vazifalar:</span>
                  <span className="ml-2 font-medium">{category.taskCount}</span>
                </div>
                <div>
                  <span className="text-gray-600">Bajarilgan:</span>
                  <span className="ml-2 font-medium text-green-600">{category.completedCount}</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(category.completedCount / category.taskCount) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6"
            >
              Bekor qilish
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              <Save className="h-4 w-4 mr-2" />
              Saqlash
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
