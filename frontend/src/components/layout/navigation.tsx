import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';

interface NavigationProps {
  onToggleSidebar: () => void;
}

export function Navigation({ onToggleSidebar }: NavigationProps) {
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/categories', label: 'Categories', icon: 'folder' },
    { path: '/jobs', label: 'Cron Jobs', icon: 'schedule' },
    { path: '/history', label: 'History', icon: 'history' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
            >
              ☰
            </button>
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">Cron Manager</h1>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium ${
                    isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">{user?.email}</span>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}