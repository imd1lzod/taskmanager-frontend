import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../hooks/redux'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Plus, Calendar, Clock, Users, CheckCircle, Circle, Play, Edit, Trash2 } from 'lucide-react'
import CreateTaskDialog from '../../components/task/CreateTaskDialog'
import EditTaskDialog from '../../components/task/EditTaskDialog'
import TaskStatus from '../../components/task/TaskStatus'
import { useTasks } from '../../hooks/tasks'

export default function DashboardPage() {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false)
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<any>(null)
  const [isFirstTime, setIsFirstTime] = useState(true)
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()

  const { data, isLoading } = useTasks()
  const tasks = (data?.items ?? []) as Array<{ id: string; title: string; description: string; status: 'todo' | 'in-progress' | 'done'; priority: 'low' | 'medium' | 'high'; createdAt: string }>

  const todoList = tasks.filter(t => t.status === 'todo')
  const doneList = tasks.filter(t => t.status === 'done')
  const inProgressList = tasks.filter(t => t.status === 'in-progress')
  const total = tasks.length || 1
  const taskStats = [
    { label: 'Bajarilgan', percentage: Math.round((doneList.length / total) * 100), color: 'text-green-600' },
    { label: 'Jarayonda', percentage: Math.round((inProgressList.length / total) * 100), color: 'text-blue-600' },
    { label: 'Boshlanmagan', percentage: Math.round((todoList.length / total) * 100), color: 'text-red-600' },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in-progress':
        return <Play className="h-4 w-4 text-blue-600" />
      case 'todo':
        return <Circle className="h-4 w-4 text-gray-400" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getPriorityBadge = (priority: 'low' | 'medium' | 'high') => (
    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
      priority === 'high' ? 'bg-red-100 text-red-800 border border-red-200' :
      priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
      'bg-green-100 text-green-800 border border-green-200'
    }`}>
      <div className={`w-2 h-2 rounded-full mr-2 ${
        priority === 'high' ? 'bg-red-500' :
        priority === 'medium' ? 'bg-yellow-500' :
        'bg-green-500'
      }`}></div>
      {priority}
    </div>
  )

  // Birinchi marta ochganda ko'rsatiladigan welcome screen
  if (isFirstTime) {
    return (
      <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-full">
        {/* Welcome Hero Section */}
        <div className="text-center py-10 sm:py-16">
          <div className="max-w-4xl mx-auto px-2">
            {/* Welcome Icon */}
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-4xl">🎯</span>
              </div>
            </div>
            
            {/* Welcome Text */}
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Xush kelibsiz, {user?.name || 'Foydalanuvchi'}! 👋
            </h1>
            <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Vazifa Boshqaruvchisiga xush kelibsiz! Bu yerda vazifalaringizni samarali boshqarish, 
              loyihalaringizni tashkil etish va maqsadlaringizga erishish uchun barcha kerakli vositalar mavjud.
            </p>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Vazifa Yaratish</h3>
                  <p className="text-gray-600">Oson va tez vazifa yaratish va tashkil etish</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Kuzatish</h3>
                  <p className="text-gray-600">Vazifalaringizning holatini kuzatish va boshqarish</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Jamoa</h3>
                  <p className="text-gray-600">Jamoangiz bilan hamkorlik qilish va vazifalarni ulashish</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Start Buttons */}
            <div className="space-y-3 sm:space-y-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setIsFirstTime(false)}
              >
                Boshqaruv paneliga o'tish
              </Button>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:space-x-4">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setIsCreateTaskOpen(true)}
                  className="px-6 py-3 w-full sm:w-auto"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Birinchi Vazifani Yaratish
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-6 py-3 w-full sm:w-auto"
                  onClick={() => navigate('/team')}
                >
                  <Users className="h-5 w-5 mr-2" />
                  Jamoa Taklif Qilish
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Create Task Dialog */}
        <CreateTaskDialog
          open={isCreateTaskOpen}
          onOpenChange={setIsCreateTaskOpen}
        />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-full">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Xush kelibsiz, {user?.name || 'amanuel'} 👋
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              <Avatar className="h-8 w-8 border-2 border-white">
                <AvatarFallback className="bg-blue-500 text-white text-xs">A</AvatarFallback>
              </Avatar>
              <Avatar className="h-8 w-8 border-2 border-white">
                <AvatarFallback className="bg-green-500 text-white text-xs">B</AvatarFallback>
              </Avatar>
              <Avatar className="h-8 w-8 border-2 border-white">
                <AvatarFallback className="bg-purple-500 text-white text-xs">C</AvatarFallback>
              </Avatar>
            </div>
            <Button size="sm" className="ml-0 sm:ml-4" onClick={() => navigate('/team')}>
              Taklif qilish
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - To-Do Tasks */}
        <div className="lg:col-span-2">
              <Card className="bg-white border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-xl font-bold text-slate-900">Bajarilishi kerak</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Bugungi vazifalar</p>
                </div>
                <Button size="sm" onClick={() => setIsCreateTaskOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Vazifa qo'shish
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div>Yuklanmoqda...</div>
              ) : todoList.length ? todoList.map((task) => (
                <div key={task.id} className="group relative border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 bg-white hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 hover:border-blue-300 hover:scale-[1.02]">
                  {/* Priority Indicator Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${
                    task.priority === 'high' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                    task.priority === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                    'bg-gradient-to-r from-green-500 to-emerald-500'
                  }`}></div>
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Task Header */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex-shrink-0">
                          {getStatusIcon(task.status)}
                        </div>
                        <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">
                          {task.title}
                        </h3>
                      </div>
                      
                      {/* Task Description */}
                      <p className="text-gray-600 mb-4 leading-relaxed text-base">
                        {task.description}
                      </p>
                      
                      {/* Task Meta Information */}
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        {/* Priority Badge */}
                        {getPriorityBadge(task.priority)}
                        
                        {/* Status Badge */}
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                          task.status === 'done' ? 'bg-green-100 text-green-800 border border-green-200' :
                          task.status === 'in-progress' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {task.status}
                        </div>
                        
                        {/* Created Date */}
                        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                          📅 {new Date(task.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Task Image/Icon */}
                    <div className="ml-6 flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <span className="text-3xl">🗒️</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Action Buttons */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex space-x-2">
                      <button 
                        className="p-2 bg-white/80 hover:bg-blue-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedTaskForEdit(task)
                          setIsEditTaskOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4 text-gray-600 hover:text-blue-600" />
                      </button>
                      <button className="p-2 bg-white/80 hover:bg-red-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                        <Trash2 className="h-4 w-4 text-gray-600 hover:text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-sm text-gray-500">Vazifalar topilmadi</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Task Status and Completed Tasks */}
        <div className="space-y-6">
          {/* Task Status */}
          <TaskStatus stats={taskStats} />

          {/* Completed Tasks */}
              <Card className="bg-white border-slate-200">
            <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-900">Bajarilgan Vazifalar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div>Yuklanmoqda...</div>
              ) : doneList.length ? doneList.map((task) => (
                <div key={task.id} className="group relative border border-green-200 rounded-xl p-5 bg-gradient-to-r from-green-50/50 to-emerald-50/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                  {/* Completed Indicator Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r from-green-500 to-emerald-500"></div>
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Task Header */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 text-base group-hover:text-green-700 transition-colors line-through">
                          {task.title}
                        </h3>
                      </div>
                      
                      {/* Task Description */}
                      <p className="text-gray-600 mb-3 leading-relaxed text-sm">
                        {task.description}
                      </p>
                      
                      {/* Task Meta Information */}
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Status Badge */}
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                          <div className="w-2 h-2 rounded-full mr-2 bg-green-500"></div>
                          done
                        </div>
                        
                        {/* Completed Date */}
                        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                          ✅ {new Date(task.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Task Image/Icon */}
                    <div className="ml-4 flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                        <span className="text-2xl">🗒️</span>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-sm text-gray-500">Bajarilgan vazifalar yo'q</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={isCreateTaskOpen}
        onOpenChange={setIsCreateTaskOpen}
      />

      {/* Edit Task Dialog */}
      <EditTaskDialog
        open={isEditTaskOpen}
        onOpenChange={setIsEditTaskOpen}
        task={selectedTaskForEdit}
      />
    </div>
  )
}
