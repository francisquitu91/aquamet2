'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Logo, SyncIndicator, SupabaseSyncIndicator } from '../ui';
import { 
  UserGroupIcon, 
  ChartBarIcon, 
  CalendarDaysIcon,
  UsersIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: ReactNode;
  activeSection?: string;
}

const navigationItems = [
  { id: 'students', name: 'Estudiantes', icon: UserGroupIcon, href: '/admin/students' },
  { id: 'users', name: 'Usuarios', icon: UsersIcon, href: '/admin/users' },
  { id: 'reports', name: 'Reportes', icon: ChartBarIcon, href: '/admin/reports' },
  { id: 'schedules', name: 'Horarios', icon: CalendarDaysIcon, href: '/admin/schedules' },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  activeSection = 'students' 
}) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleBackToHome = () => {
    logout(); // Cerrar sesión
    router.push('/'); // Redirigir al inicio
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-center h-20 px-4 border-b border-gray-200">
          <div className="flex items-center justify-center">
            <Logo size="xl" showText={false} />
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 absolute right-2"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          {/* Back to Home Button */}
          <div className="mb-6">
            <button
              onClick={handleBackToHome}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors border border-gray-200"
            >
              <ArrowLeftIcon className="mr-3 h-5 w-5" />
              Volver al Inicio
            </button>
          </div>

          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${isActive 
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <button
              onClick={handleBackToHome}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              title="Volver al Inicio"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
          </div>
          <Logo size="xl" showText={false} />
          <div className="w-10"></div>
        </div>

        {/* Header */}
        <header className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Sistema de Retiro - Administración
            </h1>
          </div>
        </header>

        {/* Content */}
        <main className="px-4 lg:px-6 py-4 lg:py-8">
          {children}
        </main>
      </div>
      
      {/* Sync indicators */}
      <div className="fixed bottom-4 left-4 space-y-2 z-30">
        <SyncIndicator />
        <SupabaseSyncIndicator />
      </div>
    </div>
  );
};
