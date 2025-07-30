'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { TeacherDashboard } from '@/components/teacher/TeacherDashboard';

export default function Home() {
  const { user, login, isLoading, error } = useAuth();

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm onLogin={login} isLoading={isLoading} error={error} />;
  }

  // Show appropriate dashboard based on user role
  if (user.role === 'admin') {
    return (
      <AdminLayout activeSection="dashboard">
        <AdminDashboard />
      </AdminLayout>
    );
  }

  // Teacher role
  return <TeacherDashboard />;
}
