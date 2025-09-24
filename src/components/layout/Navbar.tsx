import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User } from '../../types'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Search, Bell, Calendar, LogIn } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'

interface NavbarProps {
  user: User | null
  isAuthenticated: boolean
  onLogout: () => void
  onMenuClick: () => void
}

export default function Navbar({ user, isAuthenticated, onLogout, onMenuClick }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10))
  
  const currentDate = new Date()
  const options = {
    weekday: 'long' as const,
    day: '2-digit' as const,
    month: '2-digit' as const,
    year: 'numeric' as const
  }
  
  // O'zbek tilida kun nomlari
  const weekDays = {
    'Monday': 'Dushanba',
    'Tuesday': 'Seshanba', 
    'Wednesday': 'Chorshanba',
    'Thursday': 'Payshanba',
    'Friday': 'Juma',
    'Saturday': 'Shanba',
    'Sunday': 'Yakshanba'
  }
  
  const months = {
    '01': 'Yanvar',
    '02': 'Fevral',
    '03': 'Mart',
    '04': 'Aprel',
    '05': 'May',
    '06': 'Iyun',
    '07': 'Iyul',
    '08': 'Avgust',
    '09': 'Sentabr',
    '10': 'Oktabr',
    '11': 'Noyabr',
    '12': 'Dekabr'
  }
  
  const englishDate = currentDate.toLocaleDateString('en-US', options)
  const [weekdayPart, mdYPart] = englishDate.split(', ')
  const [monthNum, dayNum, year] = (mdYPart || '').split('/')
  
  const formattedDate = `${weekDays[weekdayPart as keyof typeof weekDays]}, ${dayNum} ${months[monthNum as keyof typeof months]} ${year}`

  return (
    <>
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 shadow-lg">
      <div className="flex items-center justify-between gap-2">
        {/* Left side - Mobile menu + title */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <span className="sr-only">Open menu</span>
            {/* Using Search icon for imports presence; ideally a hamburger icon would be used from props */}
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Vazifa Boshqaruvchisi</h1>
        </div>

        {/* Center - Search */}
        <div className="hidden sm:block flex-1 max-w-lg mx-2 sm:mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Vazifangizni qidiring..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-300 focus:ring-blue-200 shadow-lg"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Compact search trigger on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors sm:hidden"
            onClick={() => setIsMobileSearchOpen((v) => !v)}
            aria-label="Toggle search"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>

          {/* Calendar */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
            onClick={() => setIsCalendarOpen(true)}
            aria-label="Open calendar"
          >
            <Calendar className="h-5 w-5" />
          </Button>

          {/* Login Button */}
          {!isAuthenticated && (
            <Link to="/login">
              <Button variant="outline" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <LogIn className="h-4 w-4 mr-2" />
                Kirish
              </Button>
            </Link>
          )}

          {/* Date */}
          <div className="hidden md:block text-sm text-gray-600 font-medium">
            {formattedDate}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {isMobileSearchOpen && (
        <div className="sm:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Vazifangizni qidiring..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-300 focus:ring-blue-200 shadow-lg"
            />
          </div>
        </div>
      )}
    </header>

    {/* Calendar Dialog */}
    <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <DialogContent className="max-w-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl">Kalendar</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full sm:w-auto text-2xl p-4 border rounded-lg shadow-sm"
          />
          <div className="text-center sm:text-left">
            <div className="text-lg text-gray-600 mb-1">Tanlangan sana</div>
            <div className="text-2xl font-semibold">
              {new Date(selectedDate).toLocaleDateString('uz-UZ', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
