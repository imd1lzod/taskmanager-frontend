import { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { logout } from '../../store/slices/authSlice'
import { fetchBoards } from '../../store/slices/boardSlice'
import Sidebar from '../../components/layout/Sidebar'
import Navbar from '../../components/layout/Navbar'
import { Button } from '../../components/ui/button'
import { Menu, X } from 'lucide-react'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchBoards())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    setTimeout(() => navigate('/login'), 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onLogout={handleLogout} user={user} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top navbar */}
        <Navbar
          user={user}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Page content */}
        <main className="flex-1 bg-transparent p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile menu button removed; handled in Navbar to avoid overlap */}
    </div>
  )
}
