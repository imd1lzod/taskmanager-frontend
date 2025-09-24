import { useEffect, useState } from 'react'
import { useAppSelector } from '../../hooks/redux'
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from '../../hooks/categories'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Plus, Edit, Trash2, Folder, Calendar, Clock, Users } from 'lucide-react'
import EditCategoryDialog from '../../components/category/EditCategoryDialog'

export default function TaskCategories() {
  const [newCategory, setNewCategory] = useState('')
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false)
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState<any>(null)
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  const { data: categoriesData } = useCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()
  const categories = (categoriesData?.items ?? categoriesData ?? []).map((c: any) => ({
    id: String(c.id),
    name: c.name,
    description: c.description,
    color: 'bg-blue-500',
    taskCount: c.tasks?.length ?? 0,
    completedCount: 0,
    priority: c.priority,
  }))

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
      case 'Yuqori':
        return 'bg-red-100 text-red-800'
      case 'Medium':
      case 'O\'rta':
        return 'bg-yellow-100 text-yellow-800'
      case 'Low':
      case 'Past':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }
    await createCategory.mutateAsync({ name: newCategory.trim(), description: '', priority: 'medium' })
    setNewCategory('')
    setIsAddingCategory(false)
  }

  useEffect(() => {
    if (isAddingCategory && !isAuthenticated) {
      setIsAddingCategory(false)
      window.location.href = '/login'
    }
  }, [isAddingCategory, isAuthenticated])

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Vazifa Kategoriyalari</h1>
        <p className="text-gray-600 mt-2">Vazifalaringizni turli kategoriyalarga tashkil eting</p>
      </div>

      {/* Add Category Section */}
      <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900">Yangi Kategoriya Qo'shish</CardTitle>
          <p className="text-sm text-gray-600 mt-1">Vazifalaringizni yaxshiroq tashkil etish uchun maxsus kategoriyalar yarating</p>
        </CardHeader>
        <CardContent>
          {isAddingCategory ? (
            <div className="flex space-x-4">
              <Input
                placeholder="Kategoriya nomini kiriting"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddCategory}>Qo'shish</Button>
              <Button variant="outline" onClick={() => setIsAddingCategory(false)}>
                Bekor qilish
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsAddingCategory(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Yangi Kategoriya Qo'shish
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:scale-105">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center`}>
                    <Folder className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-blue-50"
                    onClick={() => {
                      setSelectedCategoryForEdit(category)
                      setIsEditCategoryOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-red-50"
                    onClick={() => deleteCategory.mutate(Number(category.id))}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Task Statistics */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Jami Vazifalar</span>
                  </div>
                  <Badge variant="outline">{category.taskCount}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Bajarilgan</span>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    {category.completedCount}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Muhimlik</span>
                  </div>
                  <Badge className={getPriorityColor(category.priority)}>
                    {category.priority}
                  </Badge>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Jarayon</span>
                    <span>{Math.round((category.completedCount / category.taskCount) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${category.color}`}
                      style={{
                        width: `${(category.completedCount / category.taskCount) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>

                {/* View Tasks Button */}
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300" variant="outline">
                  Vazifalarni Ko'rish
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Folder className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Hali kategoriyalar yo'q</h3>
            <p className="text-gray-600 text-center mb-4">
              Vazifalaringizni tashkil etishni boshlash uchun birinchi kategoriyangizni yarating
            </p>
            <Button onClick={() => setIsAddingCategory(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Kategoriya Yaratish
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Category Dialog */}
      <EditCategoryDialog
        open={isEditCategoryOpen}
        onOpenChange={setIsEditCategoryOpen}
        category={selectedCategoryForEdit}
      />
    </div>
  )
}
