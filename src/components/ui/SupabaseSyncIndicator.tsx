'use client';

import React from 'react';
import { useData } from '@/contexts/DataContext';
import { 
  CloudIcon, 
  CloudArrowUpIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

export const SupabaseSyncIndicator: React.FC = () => {
  const { loading, error } = useData();

  const getStatusIcon = () => {
    if (loading) {
      return <CloudArrowUpIcon className="h-4 w-4 text-blue-600 animate-spin" />;
    }
    if (error) {
      return <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />;
    }
    return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
  };

  const getStatusText = () => {
    if (loading) {
      return 'Cargando...';
    }
    if (error) {
      return 'Error DB';
    }
    return 'Conectado';
  };

  const getStatusColor = () => {
    if (loading) {
      return 'text-blue-600';
    }
    if (error) {
      return 'text-red-600';
    }
    return 'text-green-600';
  };

  return (
    <div className="flex items-center space-x-2 text-xs">
      {getStatusIcon()}
      <span className={getStatusColor()}>
        Supabase: {getStatusText()}
      </span>
    </div>
  );
};
