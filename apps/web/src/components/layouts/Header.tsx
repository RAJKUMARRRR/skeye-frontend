import { useAuth } from '../../features/auth/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Bell, Search, LogOut, ChevronDown, User } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = async () => {
    await logout()
    // Logout function already handles redirect to /login
  }

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-accent-100 text-accent-700 border-accent-200',
      manager: 'bg-blue-100 text-blue-700 border-blue-200',
      dispatcher: 'bg-purple-100 text-purple-700 border-purple-200',
      driver: 'bg-gray-100 text-gray-700 border-gray-200',
      super_admin: 'bg-error-100 text-error-700 border-error-200',
    }
    return colors[role as keyof typeof colors] || colors.driver
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="px-6 py-3.5">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex items-center gap-3 max-w-xl flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Skeye"
                className="w-full h-10 pl-10 pr-4 bg-gray-100 border-0 rounded-md text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-block px-2 py-0.5 text-xs font-mono text-gray-500 bg-white border border-gray-300 rounded">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right Section - Notifications & Profile */}
          <div className="flex items-center gap-2">
            {/* Date Display */}
            <p className="hidden xl:block text-xs text-gray-600 mr-4">
              {new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full border-2 border-white" />
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-200 mx-2" />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-gray-100 rounded-md transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-600 flex items-center justify-center text-white font-medium text-sm">
                  {user?.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className={`text-xs px-1.5 py-0.5 rounded border inline-block capitalize ${getRoleColor(user?.role || 'driver')}`}>
                    {user?.role.replace('_', ' ')}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl py-1.5">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{user?.email}</p>
                  </div>

                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile Settings
                  </button>

                  <div className="border-t border-gray-100 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
