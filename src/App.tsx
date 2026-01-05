import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { useAppSelector } from './hooks/redux'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import DashboardPage from './pages/Dashboard/DashboardPage'
import MyTasks from './pages/Dashboard/MyTasks'
import VitalTasks from './pages/Dashboard/VitalTasks'
import TaskCategories from './pages/Dashboard/TaskCategories'
import Help from './pages/Dashboard/Help'
import Boards from './pages/Dashboard/Boards'
import BoardPage from './pages/Dashboard/BoardPage'
import Settings from './pages/Dashboard/Settings'
import TeamInvitations from './pages/Dashboard/TeamInvitations'
import AcceptInvitation from './pages/Auth/AcceptInvitation'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/invite/:token" element={<AcceptInvitation />} />
            <Route path="/" element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />}>
                <Route index element={<DashboardPage />} />
                <Route path="my-tasks" element={<MyTasks />} />
                <Route path="vital" element={<VitalTasks />} />
                <Route path="categories" element={<TaskCategories />} />
                <Route path="team" element={<TeamInvitations />} />
                <Route path="help" element={<Help />} />
                <Route path="boards" element={<Boards />} />
                <Route path="board/:id" element={<BoardPage />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </Router>
    </Provider>
  )
}

function ProtectedRoute() {
  const { initialized, isLoading } = useAppSelector((state) => state.auth)

  // Wait for initialization to avoid flicker
  if (!initialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Yuklanmoqda...</div>
      </div>
    )
  }

  // Always allow access to dashboard, authentication is optional
  return <Outlet />
}

export default App
