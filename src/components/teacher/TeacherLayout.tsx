'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button, SyncIndicator, SupabaseSyncIndicator, Logo } from '../ui';
import { 
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface TeacherLayoutProps {
  children: ReactNode;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  searchValue?: string;
}

export const TeacherLayout: React.FC<TeacherLayoutProps> = ({ 
  children, 
  showSearch = false, 
  onSearch, 
  searchValue = '' 
}) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 py-4">
          {/* Top section with logo and user info */}
          <div className="flex items-center justify-between mb-4">
            <Logo size="xl" showText={false} className="flex-shrink-0" />
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-blue-700">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500">
                    {user?.role === 'inspector' ? 'Inspector' : 'Profesor'}
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={logout}
                className="p-2 flex-shrink-0"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-4">
            Sistema de Retiro
          </h1>

          {/* Search bar */}
          {showSearch && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar estudiante..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                value={searchValue}
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="px-4 sm:px-6 py-4 sm:py-6">
        {children}
      </main>
      
      {/* Sync indicators */}
      <div className="fixed bottom-4 left-4 space-y-2 z-20">
        <SyncIndicator />
        <SupabaseSyncIndicator />
      </div>
    </div>
  );
};
