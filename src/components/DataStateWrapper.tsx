'use client';

import React from 'react';
import { useData } from '@/contexts/DataContext';
import { 
  ExclamationTriangleIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

interface DataStateWrapperProps {
  children: React.ReactNode;
}

export const DataStateWrapper: React.FC<DataStateWrapperProps> = ({ children }) => {
  const { loading, error, refetch } = useData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Cargando datos desde Supabase...
          </h2>
          <p className="text-gray-600">
            Sincronizando estudiantes, cursos y registros
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error de conexión
          </h2>
          <p className="text-gray-600 mb-4">
            No se pudo cargar los datos desde Supabase: {error}
          </p>
          <button
            onClick={refetch}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
