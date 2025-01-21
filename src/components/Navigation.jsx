import { Link, useLocation } from 'react-router-dom'

export default function Navigation() {
  const location = useLocation()
  
  const menus = [
    { path: '/', label: 'Home' },
    { path: '/wordquiz1', label: '낱말완성퀴즈' },
    { path: '/wordquiz2', label: '문장퀴즈' },
    { path: '/wordquiz3', label: '자음모음조합퀴즈' }
  ]

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center gap-1 h-14">
          {menus.map(menu => (
            <Link
              key={menu.path}
              to={menu.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                location.pathname === menu.path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {menu.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 