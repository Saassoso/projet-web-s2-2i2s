// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UserIcon, 
  CogIcon, 
  BellIcon,
  ClipboardListIcon,
  ChartBarIcon,
  MenuIcon,
  XIcon
} from '@heroicons/react/outline';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
    { name: 'Teams', href: '/teams', icon: ChartBarIcon },
    { name: 'Standing', href: '/StandingPage', icon: ClipboardListIcon },
    { name: 'Notifications', href: '/notifications', icon: BellIcon },
    //{ name: 'Settings', href: '/settings', icon: CogIcon },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white p-2 rounded-md shadow-md"
        >
          {isOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:inset-0
      `}>
        <div className="flex items-center justify-center h-16 bg-gray-800">
          <span className="text-white text-xl font-bold">MyApp</span>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive(item.href)
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;