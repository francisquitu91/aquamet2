'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { EnhancedLoginForm } from '@/components/auth/EnhancedLoginForm';
import { TeacherDashboard } from '@/components/teacher/TeacherDashboard';

export default function Home() {
  const { user, login, loginAsParent, isLoading, error } = useAuth();
  const router = useRouter();

  // Redirect users after login based on role
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.replace('/admin/students');
      } else if (user.role === 'Parent') {
        router.replace('/parent');
      }
    }
  }, [user, router]);

  // Show login form if not authenticated
  if (!user) {
    return (
      <EnhancedLoginForm 
        onStaffLogin={login}
        onParentLogin={loginAsParent}
        isLoading={isLoading} 
        error={error} 
      />
    );
  }

  // Show loading for redirecting users
  if (user.role === 'admin' || user.role === 'Parent') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {user.role === 'admin' ? 'Redirigiendo a Estudiantes...' : 'Redirigiendo a Panel de Apoderado...'}
          </p>
        </div>
      </div>
    );
  }

  // Teacher and Inspector roles use the same interface
  return <TeacherDashboard />;
}
