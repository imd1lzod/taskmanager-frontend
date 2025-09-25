import { Link, useLocation } from 'react-router-dom'
import { User } from '../../types'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  LayoutDashboard,
  Settings,
  LogOut,
  CheckSquare,
  Star,
  List,
  HelpCircle,
  Menu,
} from 'lucide-react'

interface SidebarProps {
  onLogout: () => void
  user?: User | null
}

export default function Sidebar({ onLogout, user }: SidebarProps) {
  const location = useLocation()

  const navigation = [
    {
      name: 'Boshqaruv Paneli',
      href: '/',
      icon: LayoutDashboard,
      current: location.pathname === '/',
    },
    {
      name: 'Muhim Vazifalar',
      href: '/vital',
      icon: Star,
      current: location.pathname === '/vital',
    },
    {
      name: 'Mening Vazifalarim',
      href: '/my-tasks',
      icon: List,
      current: location.pathname === '/my-tasks',
    },
    {
      name: 'Vazifa Kategoriyalari',
      href: '/categories',
      icon: Menu,
      current: location.pathname === '/categories',
    },
    {
      name: 'Jamoa / Takliflar',
      href: '/team',
      icon: CheckSquare,
      current: location.pathname === '/team',
    },
    {
      name: 'Sozlamalar',
      href: '/settings',
      icon: Settings,
      current: location.pathname === '/settings',
    },
    {
      name: 'Yordam',
      href: '/help',
      icon: HelpCircle,
      current: location.pathname === '/help',
    },
  ]

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-sm text-gray-900 border-r border-gray-200">
      {/* User Profile Section */}
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12 ring-2 ring-blue-200">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
              {user?.initials || 'A'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-gray-900">{user?.name || 'amanuel'}</h3>
            <p className="text-sm text-gray-500">{user?.email || 'amanuel@gmail.com'}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-300',
                item.current
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-md border border-blue-200'
                  : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50/50 hover:shadow-sm'
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
          onClick={onLogout}
          asChild
        >
          <span><LogOut className="mr-3 h-4 w-4" />Chiqish</span>
        </Button>
      </div>
    </div>
  )
}
