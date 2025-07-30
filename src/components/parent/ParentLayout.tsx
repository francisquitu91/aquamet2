'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

interface ParentLayoutProps {
  children: React.ReactNode;
}

const ParentLayout: React.FC<ParentLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navigation = [
    { name: 'Bienvenido/a', href: '/parent', icon: HomeIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Header */}
      <header className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Logo className="h-16 w-auto" />
              <nav className="flex space-x-8">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center"
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">{user?.email}</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Apoderado
                </span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                className="flex items-center"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
              <Logo className="h-16 w-auto ml-3" />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Apoderado
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                className="p-2"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="fixed top-16 left-0 bottom-0 w-64 bg-white shadow-xl overflow-y-auto">
              <nav className="px-4 py-6 space-y-2">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    {item.name}
                  </a>
                ))}
              </nav>
              
              <div className="border-t border-gray-200 mt-6 pt-6 px-4">
                <div className="flex items-center space-x-3 mb-4">
                  <UserIcon className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                    <p className="text-xs text-gray-500">Apoderado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};

export default ParentLayout;
