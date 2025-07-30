import React from 'react';
import Link from 'next/link';
import { useData } from '@/contexts/DataContext';
import { Card } from '../ui';
import { startOfDay, endOfDay } from 'date-fns';
import { 
  UserGroupIcon, 
  CheckCircleIcon, 
  ClockIcon,
  AcademicCapIcon,
  ChartBarIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

export const AdminDashboard: React.FC = () => {
  const { studentsWithCourses, courses, pickupLogs } = useData();

  // Calculate statistics - ONLY USING SUPABASE DATA
  const totalStudents = studentsWithCourses.length;
  
  // Calculate today's pickups from Supabase pickup_logs, not local status
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  const pickedUpToday = pickupLogs.filter(log => {
    const logDate = new Date(log.pickup_timestamp);
    return logDate >= todayStart && logDate <= todayEnd;
  }).length;
  
  const remainingStudents = totalStudents - pickedUpToday;
  const totalCourses = courses.length;

  const stats = [
    {
      title: 'Total Estudiantes',
      value: totalStudents,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Retirados Hoy',
      value: pickedUpToday,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Pendientes',
      value: remainingStudents,
      icon: ClockIcon,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Cursos',
      value: totalCourses,
      icon: AcademicCapIcon,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Sync notification banner */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                🔄
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">
                ¡Sincronización en Tiempo Real Activada!
              </p>
              <p className="text-xs text-blue-700">
                Los cambios se sincronizan automáticamente entre Admin y Teacher
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome message */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-2 text-gray-600">
          Resumen del estado actual del sistema de retiro
        </p>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick actions - now full width */}
      <div className="grid grid-cols-1 gap-8">
        {/* Status by course */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Estado por Curso
            </h3>
            <div className="space-y-3">
              {courses.map((course) => {
                const courseStudents = studentsWithCourses.filter(s => s.course_id === course.id);
                
                // Calculate course pickups from Supabase pickup_logs, not local status
                const todayPickupsForCourse = pickupLogs.filter(log => {
                  const logDate = new Date(log.pickup_timestamp);
                  const student = studentsWithCourses.find(s => s.id === log.student_id);
                  return student?.course_id === course.id && 
                         logDate >= todayStart && 
                         logDate <= todayEnd;
                }).length;
                
                const total = courseStudents.length;
                const percentage = total > 0 ? (todayPickupsForCourse / total) * 100 : 0;

                return (
                  <div key={course.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{course.name}</span>
                      <span className="text-sm text-gray-600">
                        {todayPickupsForCourse}/{total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick links */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/students"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <UserGroupIcon className="h-8 w-8 text-blue-600 mb-2" />
              <h4 className="font-medium text-gray-900">Gestionar Estudiantes</h4>
              <p className="text-sm text-gray-600">Agregar, editar o eliminar estudiantes</p>
            </Link>
            <Link
              href="/admin/users"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <UsersIcon className="h-8 w-8 text-purple-600 mb-2" />
              <h4 className="font-medium text-gray-900">Gestionar Usuarios</h4>
              <p className="text-sm text-gray-600">Crear cuentas para profesores</p>
            </Link>
            <Link
              href="/admin/reports"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ChartBarIcon className="h-8 w-8 text-green-600 mb-2" />
              <h4 className="font-medium text-gray-900">Ver Reportes</h4>
              <p className="text-sm text-gray-600">Estadísticas y reportes detallados</p>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};
