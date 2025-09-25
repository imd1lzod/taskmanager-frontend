import { useState } from 'react'
import { useAppSelector } from '../../hooks/redux'
// Removed unused Button import
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Trash2, Edit, Circle, Play, CheckCircle } from 'lucide-react'
import EditTaskDialog from '../../components/task/EditTaskDialog'
import { useTasks } from '../../hooks/tasks'

export default function MyTasks() {
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false)
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<any>(null)
  const { user: _user } = useAppSelector((state) => state.auth)

  const { data, isLoading } = useTasks()
  const tasks = (data?.items ?? []) as Array<any>

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

  // removed unused getPriorityColor

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'text-red-600'
      case 'in-progress':
        return 'text-blue-600'
      case 'done':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
        <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mening Vazifalarim</h1>
        <p className="text-gray-600 mt-2">Shaxsiy vazifalaringizni va topshiriqlaringizni boshqaring</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Task List */}
        <div>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900">Mening Vazifalarim</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Batafsil ma'lumot uchun har qanday vazifani bosing</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div>Yuklanmoqda...</div>
              ) : tasks.length ? tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`group relative border border-gray-200 rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 bg-white hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 hover:border-blue-300 hover:scale-[1.02] ${
                    selectedTask?.id === task.id ? 'ring-2 ring-blue-500 bg-blue-50/80 shadow-lg' : ''
                  }`}
                  onClick={() => setSelectedTask(task)}
                >
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
                      <p className="text-gray-600 mb-4 leading-relaxed text-base">{task.description}</p>
                      
                      {/* Task Meta Information */}
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        {/* Priority Badge */}
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800 border border-red-200' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                          'bg-green-100 text-green-800 border border-green-200'
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            task.priority === 'high' ? 'bg-red-500' :
                            task.priority === 'medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}></div>
                          {task.priority}
                        </div>
                        
                        {/* Status Badge */}
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                          task.status === 'done' ? 'bg-green-100 text-green-800 border border-green-200' :
                          task.status === 'in-progress' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {task.status}
                        </div>
                        
                        {/* Created Date */}
                        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">📅 {new Date(task.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    {/* Task Image/Icon */}
                    <div className="ml-6 flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg"><span className="text-3xl">🗒️</span></div>
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

        {/* Right Column - Task Details */}
        <div>
          {selectedTask ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedTask.title}</h2>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span>Muhimlik: {selectedTask.priority}</span>
                      <span className={getStatusColor(selectedTask.status)}>Holat: {selectedTask.status}</span>
                      <span>Yaratilgan: {new Date(selectedTask.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-3xl">🗒️</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Vazifa Tavsifi</h3>
                  <p className="text-gray-700">{selectedTask.description}</p>
                </div>
                <div className="text-sm text-gray-600">Yaratilgan: {new Date(selectedTask.createdAt).toLocaleDateString()}</div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center text-gray-500">
                  <p className="text-lg">Batafsil ma'lumot uchun vazifani tanlang</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Edit Task Dialog */}
      <EditTaskDialog
        open={isEditTaskOpen}
        onOpenChange={setIsEditTaskOpen}
        task={selectedTaskForEdit}
      />
    </div>
  )
}
