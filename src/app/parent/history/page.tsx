'use client';

import { useEffect, useState } from 'react';
import ParentLayout from '@/components/parent/ParentLayout';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { PickupLog, Student, AuthorizedPerson, StudentWithCourse } from '@/types';
import {
  ClockIcon,
  UserIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface PickupLogWithDetails extends PickupLog {
  student: Student;
  authorized_person: AuthorizedPerson;
}

const ParentHistory = () => {
  const { user } = useAuth();
  const { studentsWithCourses, authorizedPersons, pickupLogs } = useSupabaseData();
  const [myStudent, setMyStudent] = useState<StudentWithCourse | null>(null);
  const [myPickupHistory, setMyPickupHistory] = useState<PickupLogWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      if (user?.email && studentsWithCourses.length > 0) {
        // Buscar el estudiante que corresponde al RUT del apoderado
        const studentRut = user.email;
        const foundStudent = studentsWithCourses.find(student => 
          student.rut_passport === studentRut
        );
        
        if (foundStudent) {
          setMyStudent(foundStudent);
          
          // Buscar el historial de retiros para este estudiante
          const studentPickups = pickupLogs
            .filter(log => log.student_id === foundStudent.id)
            .map(log => {
              const student = studentsWithCourses.find(s => s.id === log.student_id);
              const authorizedPerson = authorizedPersons.find(p => p.id === log.authorized_person_id);
              
              return {
                ...log,
                student: student || foundStudent,
                authorized_person: authorizedPerson || {
                  id: 'unknown',
                  full_name: 'Persona no identificada',
                  relationship: 'Desconocido',
                  student_id: log.student_id
                }
              } as PickupLogWithDetails;
            })
            .sort((a, b) => new Date(b.pickup_timestamp).getTime() - new Date(a.pickup_timestamp).getTime());
          
          setMyPickupHistory(studentPickups);
        }
      }
      
      setIsLoading(false);
    };

    loadData();
  }, [user, studentsWithCourses, authorizedPersons, pickupLogs]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date(date));
  };

  const formatDateTime = (date: Date) => {
    const dateObj = new Date(date);
    return {
      date: formatDate(dateObj),
      time: formatTime(dateObj),
      relative: getRelativeTime(dateObj)
    };
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de una hora';
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `Hace ${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''}`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `Hace ${diffInMonths} mes${diffInMonths > 1 ? 'es' : ''}`;
  };

  if (!myStudent) {
    return (
      <ParentLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No se encontró información del estudiante
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No se pudo encontrar un estudiante asociado a su RUT.
            </p>
          </div>
        </div>
      </ParentLayout>
    );
  }

  return (
    <ParentLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Historial de Retiros
          </h1>
          <p className="text-gray-600">
            Registro completo de retiros de {myStudent.full_name}
          </p>
        </div>

        {/* Student Info Card */}
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <UserIcon className="h-10 w-10 text-gray-400 bg-gray-100 rounded-full p-2" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">
                  {myStudent.full_name}
                </h2>
                <p className="text-sm text-gray-600 font-mono">
                  RUT: {myStudent.rut_passport}
                </p>
                <p className="text-sm text-gray-600">
                  Curso: {myStudent.course?.name || 'No asignado'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* History Section */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2" />
                Historial de Retiros
              </h3>
              <span className="text-sm text-gray-500">
                {myPickupHistory.length} retiro{myPickupHistory.length !== 1 ? 's' : ''} registrado{myPickupHistory.length !== 1 ? 's' : ''}
              </span>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Cargando historial...</p>
              </div>
            ) : myPickupHistory.length > 0 ? (
              <div className="space-y-4">
                {myPickupHistory.map((pickup) => {
                  const dateTime = formatDateTime(pickup.pickup_timestamp);
                  
                  return (
                    <div
                      key={pickup.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                            <span className="text-sm font-medium text-green-800">
                              Retiro Exitoso
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              {dateTime.relative}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                Retirado por:
                              </p>
                              <p className="text-sm text-gray-600">
                                {pickup.authorized_person.full_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {pickup.authorized_person.relationship}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                Registrado por:
                              </p>
                              <p className="text-sm text-gray-600">
                                {pickup.recorded_by_user}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right ml-4 flex-shrink-0">
                          <div className="flex items-center text-gray-500 mb-1">
                            <CalendarDaysIcon className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium">
                              {dateTime.time}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 capitalize">
                            {dateTime.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h4 className="mt-2 text-sm font-medium text-gray-900">
                  El alumno no tiene historial de retiros
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  No se han registrado retiros para este estudiante hasta el momento.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Summary Stats */}
        {myPickupHistory.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {myPickupHistory.length}
                </div>
                <p className="text-sm text-gray-600">Total de Retiros</p>
              </div>
            </Card>
            
            <Card>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {new Set(myPickupHistory.map(p => p.authorized_person_id)).size}
                </div>
                <p className="text-sm text-gray-600">Personas Distintas</p>
              </div>
            </Card>
            
            <Card>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {myPickupHistory.length > 0 ? formatDate(new Date(myPickupHistory[0].pickup_timestamp)) : 'N/A'}
                </div>
                <p className="text-sm text-gray-600">Último Retiro</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </ParentLayout>
  );
};

export default ParentHistory;
