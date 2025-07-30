'use client';

import { useEffect, useState } from 'react';
import ParentLayout from '@/components/parent/ParentLayout';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Student, AuthorizedPerson, StudentWithCourse, PickupLog, Schedule } from '@/types';
import {
  UserIcon,
  UsersIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  AcademicCapIcon,
  BookOpenIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

const ParentDashboard = () => {
  const { user } = useAuth();
  const { studentsWithCourses, authorizedPersons, pickupLogs, schedules } = useSupabaseData();
  const [myStudent, setMyStudent] = useState<StudentWithCourse | null>(null);
  const [myAuthorizedPersons, setMyAuthorizedPersons] = useState<AuthorizedPerson[]>([]);
  const [myPickupHistory, setMyPickupHistory] = useState<PickupLog[]>([]);
  const [currentActivity, setCurrentActivity] = useState<{
    subject: string;
    isInClass: boolean;
    startTime: string;
    endTime: string;
  } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Función para normalizar RUT (remover puntos, guiones y espacios, convertir a minúsculas)
  const normalizeRUT = (rut: string): string => {
    return rut.replace(/[.\-\s]/g, '').toLowerCase().trim();
  };

  // Función para calcular la actividad actual del estudiante
  const getCurrentActivity = () => {
    if (!myStudent || !schedules.length) return null;

    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Minutes since midnight

    // Convertir día de JS (0=Sunday) a día de BD (1=Monday)
    const dayOfWeek = currentDay === 0 ? 7 : currentDay;

    // Obtener horarios del curso del estudiante para el día actual
    const todaySchedules = schedules.filter(schedule => 
      schedule.course_id === myStudent.course_id && 
      schedule.day_of_week === dayOfWeek
    );

    // Encontrar la clase actual
    for (const schedule of todaySchedules) {
      const [startHour, startMinute] = schedule.start_time.split(':').map(Number);
      const [endHour, endMinute] = schedule.end_time.split(':').map(Number);
      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;

      if (currentTime >= startTime && currentTime < endTime) {
        return {
          subject: schedule.subject,
          isInClass: true,
          startTime: schedule.start_time,
          endTime: schedule.end_time
        };
      }
    }

    // Si no está en clase, está en recreo
    return {
      subject: 'Recreo',
      isInClass: false,
      startTime: '',
      endTime: ''
    };
  };

  // Actualizar la hora actual cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(timer);
  }, []);

  // Actualizar actividad actual cuando cambie el estudiante, horarios o la hora
  useEffect(() => {
    const activity = getCurrentActivity();
    setCurrentActivity(activity);
  }, [myStudent, schedules, currentTime]);

  // Funciones para formatear fechas
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

  useEffect(() => {
    if (user?.email && studentsWithCourses.length > 0) {
      // Buscar el estudiante que corresponde al RUT del apoderado
      // El email del usuario será el RUT del estudiante
      const studentRut = normalizeRUT(user.email);
      const foundStudent = studentsWithCourses.find(student => 
        normalizeRUT(student.rut_passport || '') === studentRut
      );
      
      if (foundStudent) {
        setMyStudent(foundStudent);
        
        // Buscar las personas autorizadas para este estudiante
        const studentAuthorized = authorizedPersons.filter(person => 
          person.student_id === foundStudent.id
        );
        setMyAuthorizedPersons(studentAuthorized);

        // Buscar el historial de retiros para este estudiante
        const studentPickups = pickupLogs
          .filter(log => log.student_id === foundStudent.id)
          .sort((a, b) => new Date(b.pickup_timestamp).getTime() - new Date(a.pickup_timestamp).getTime())
          .slice(0, 5); // Mostrar solo los últimos 5 retiros
        
        setMyPickupHistory(studentPickups);
      }
    }
  }, [user, studentsWithCourses, authorizedPersons, pickupLogs]);

  if (!myStudent) {
    return (
      <ParentLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h3 className="mt-4 text-sm font-medium text-gray-900">
              Verificando información del estudiante...
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Por favor espere un momento
            </p>
          </div>
        </div>
      </ParentLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Presente':
        return 'bg-green-100 text-green-800';
      case 'Retirado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <ParentLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Bienvenido/a
          </h1>
          <p className="text-gray-600">
            Información de retiro y estado de su hijo/a
          </p>
        </div>

        {/* Student Information Card */}
        <Card>
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserIcon className="h-10 w-10 text-gray-400 bg-gray-100 rounded-full p-2" />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    {myStudent.full_name}
                  </h2>
                  <p className="text-sm text-gray-600 font-mono">
                    RUT: {myStudent.rut_passport}
                  </p>
                </div>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(myStudent.status)}`}>
                {myStudent.status === 'Presente' && <CheckCircleIcon className="h-4 w-4 mr-1" />}
                {myStudent.status === 'Retirado' && <ClockIcon className="h-4 w-4 mr-1" />}
                {myStudent.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center">
                <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Curso</p>
                  <p className="text-sm text-gray-600">{myStudent.course?.name || 'No asignado'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <UsersIcon className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Personas Autorizadas</p>
                  <p className="text-sm text-gray-600">{myAuthorizedPersons.length} registrada{myAuthorizedPersons.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Current Activity Card */}
        {currentActivity && (
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Actividad Actual
                </h3>
                <div className="text-sm text-gray-500">
                  {currentTime.toLocaleTimeString('es-CL', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                  })}
                </div>
              </div>

              {currentActivity.isInClass ? (
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BookOpenIcon className="h-10 w-10 text-blue-600 bg-blue-100 rounded-full p-2" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xl font-semibold text-gray-900">
                      {currentActivity.subject}
                    </p>
                    <p className="text-sm text-gray-600">
                      En clase desde las {currentActivity.startTime} hasta las {currentActivity.endTime}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="flex-shrink-0 relative">
                    <PlayIcon className="h-10 w-10 text-green-600 bg-green-100 rounded-full p-2 animate-pulse" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-ping"></div>
                  </div>
                  <div className="ml-4">
                    <p className="text-xl font-semibold text-green-700">
                      {currentActivity.subject}
                    </p>
                    <p className="text-sm text-gray-600">
                      Su hijo/a está actualmente en recreo
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Status Alert */}
        {myStudent.status === 'Presente' && (
          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-green-900">
                    Su hijo/a está presente en el colegio
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    Puede ser retirado/a por cualquiera de las personas autorizadas registradas.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {myStudent.status === 'Retirado' && (
          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <ClockIcon className="h-6 w-6 text-gray-600 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Su hijo/a ya fue retirado/a del colegio
                  </h3>
                  <p className="text-sm text-gray-700 mt-1">
                    El retiro fue realizado el día de hoy. Puede consultar el historial para más detalles.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Authorized Persons Summary */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <UsersIcon className="h-5 w-5 mr-2" />
              Personas Autorizadas para Retiro
            </h3>
            
            {myAuthorizedPersons.length > 0 ? (
              <div className="space-y-3">
                {myAuthorizedPersons.map((person) => (
                  <div key={person.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{person.full_name}</p>
                      <p className="text-sm text-gray-600">{person.relationship}</p>
                    </div>
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <UsersIcon className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  No hay personas autorizadas registradas
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Contacte al administrador para agregar personas autorizadas
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <div className="p-4 text-center">
              <UserIcon className="mx-auto h-8 w-8 text-blue-600 mb-2" />
              <h4 className="text-sm font-medium text-gray-900">Información del Estudiante</h4>
              <p className="text-xs text-gray-600 mt-1">Ver detalles completos</p>
            </div>
          </Card>
          
          <Card>
            <div className="p-4 text-center">
              <UsersIcon className="mx-auto h-8 w-8 text-green-600 mb-2" />
              <h4 className="text-sm font-medium text-gray-900">Personas Autorizadas</h4>
              <p className="text-xs text-gray-600 mt-1">Gestionar autorizaciones</p>
            </div>
          </Card>
          
          <Card>
            <div className="p-4 text-center">
              <ClockIcon className="mx-auto h-8 w-8 text-purple-600 mb-2" />
              <h4 className="text-sm font-medium text-gray-900">Historial</h4>
              <p className="text-xs text-gray-600 mt-1">Ver retiros anteriores</p>
            </div>
          </Card>
        </div>

        {/* Historial de Retiros */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <ClockIcon className="h-5 w-5 mr-2" />
              Últimos Retiros
            </h3>
            
            {myPickupHistory.length > 0 ? (
              <div className="space-y-4">
                {myPickupHistory.map((pickup) => {
                  // Buscar la persona autorizada
                  const authorizedPerson = authorizedPersons.find(p => p.id === pickup.authorized_person_id);
                  
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
                              {getRelativeTime(pickup.pickup_timestamp)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                Retirado por:
                              </p>
                              <p className="text-sm text-gray-600">
                                {authorizedPerson?.full_name || 'Persona no identificada'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {authorizedPerson?.relationship || 'Relación desconocida'}
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
                            <ClockIcon className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium">
                              {formatTime(pickup.pickup_timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 capitalize">
                            {formatDate(pickup.pickup_timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <ClockIcon className="mx-auto h-8 w-8 text-gray-400" />
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
      </div>
    </ParentLayout>
  );
};

export default ParentDashboard;
