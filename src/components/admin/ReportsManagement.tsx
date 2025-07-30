import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, Button } from '../ui';
import { format, startOfDay, endOfDay } from 'date-fns';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';
import {
  CalendarIcon,
  DocumentArrowDownIcon,
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export const ReportsManagement: React.FC = () => {
  const { studentsWithCourses, courses, pickupLogs, authorizedPersons } = useData();

  // Estado para los filtros de Retiros Recientes
  const [recentPickupsFilters, setRecentPickupsFilters] = useState({
    dateStart: '',
    dateEnd: '',
    student: '',
    course: '',
    relationship: ''
  });

  // Función para limpiar filtros de retiros recientes
  const clearRecentPickupsFilters = () => {
    setRecentPickupsFilters({
      dateStart: '',
      dateEnd: '',
      student: '',
      course: '',
      relationship: ''
    });
  };

  // Generate daily pickup data for the last 7 days
  // const dailyPickupData = Array.from({ length: 7 }, (_, i) => {
  //   const date = subDays(new Date(), 6 - i);
  //   const dayLogs = pickupLogs.filter(log => {
  //     const logDate = new Date(log.pickup_timestamp);
  //     return logDate >= startOfDay(date) && logDate <= endOfDay(date);
  //   });
    
  //   return {
  //     date: format(date, 'dd/MM', { locale: es }),
  //     fullDate: format(date, 'PPPP', { locale: es }),
  //     pickups: dayLogs.length,
  //     students: studentsWithCourses.length
  //   };
  // });

  // Generate pickup data by authorized person type
  const relationshipPickupData = authorizedPersons.reduce((acc, person) => {
    const personPickups = pickupLogs.filter(log => log.authorized_person_id === person.id).length;
    const existing = acc.find(item => item.relationship === person.relationship);
    
    if (existing) {
      existing.count += personPickups;
    } else {
      acc.push({
        relationship: person.relationship,
        count: personPickups
      });
    }
    
    return acc;
  }, [] as Array<{ relationship: string; count: number }>);

  // Generate pickup distribution with custom time ranges
  const hourlyPickupData = (() => {
    const intervals = [];
    
    // Helper function to count pickups in a time range
    const countPickupsInRange = (startHour: number, startMinute: number, endHour: number, endMinute: number) => {
      return pickupLogs.filter(log => {
        const logDate = new Date(log.pickup_timestamp);
        const logHour = logDate.getHours();
        const logMinutes = logDate.getMinutes();
        const logTotalMinutes = logHour * 60 + logMinutes;
        const rangeStart = startHour * 60 + startMinute;
        const rangeEnd = endHour * 60 + endMinute;
        
        return logTotalMinutes >= rangeStart && logTotalMinutes < rangeEnd;
      }).length;
    };
    
    // 1. Fixed range: 8:00 - 16:00
    const morningPickups = countPickupsInRange(8, 0, 16, 0);
    intervals.push({
      hour: '08:00-16:00',
      pickups: morningPickups
    });
    
    // 2. 5-minute intervals from 16:05 to 16:25
    const afternoonIntervals = [
      { start: [16, 5], end: [16, 10], label: '16:05-16:10' },
      { start: [16, 10], end: [16, 15], label: '16:10-16:15' },
      { start: [16, 15], end: [16, 20], label: '16:15-16:20' },
      { start: [16, 20], end: [16, 25], label: '16:20-16:25' }
    ];
    
    afternoonIntervals.forEach(interval => {
      const pickups = countPickupsInRange(
        interval.start[0], interval.start[1],
        interval.end[0], interval.end[1]
      );
      intervals.push({
        hour: interval.label,
        pickups: pickups
      });
    });
    
    // 3. Fixed range: 16:30 - 18:30
    const eveningPickups = countPickupsInRange(16, 30, 18, 30);
    intervals.push({
      hour: '16:30-18:30',
      pickups: eveningPickups
    });
    
    return intervals;
  })();

  // Color schemes for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

  // Statistics - ONLY USING SUPABASE DATA
  const totalStudents = studentsWithCourses.length;
  
  // Calculate today's pickups from Supabase pickup_logs, not local status
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  const totalPickupsToday = pickupLogs.filter(log => {
    const logDate = new Date(log.pickup_timestamp);
    return logDate >= todayStart && logDate <= todayEnd;
  }).length;
  
  const totalPickupsAllTime = pickupLogs.length;
  const averagePickupsPerDay = Math.round(totalPickupsAllTime / 7);

  const stats = [
    {
      title: 'Total Estudiantes',
      value: totalStudents,
      icon: UsersIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Retiros Hoy',
      value: totalPickupsToday,
      icon: ClockIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Total Retiros',
      value: totalPickupsAllTime,
      icon: ChartBarIcon,
      color: 'bg-purple-500',
    },
    {
      title: 'Promedio/Día',
      value: averagePickupsPerDay,
      icon: CalendarIcon,
      color: 'bg-orange-500',
    },
  ];

  const exportToCSV = () => {
    const headers = ['Fecha', 'Estudiante', 'Curso', 'Persona Autorizada', 'Relación', 'Registrado Por'];
    const rows = pickupLogs.map(log => {
      const student = studentsWithCourses.find(s => s.id === log.student_id);
      const person = authorizedPersons.find(p => p.id === log.authorized_person_id);
      
      return [
        format(new Date(log.pickup_timestamp), 'dd/MM/yyyy HH:mm'),
        student?.full_name || '',
        student?.course.name || '',
        person?.full_name || '',
        person?.relationship || '',
        log.recorded_by_user
      ];
    });

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `retiros_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  // Filtrado de retiros recientes
  const filteredRecentPickups = pickupLogs
    .filter(log => {
      const pickupDate = new Date(log.pickup_timestamp);
      
      // Filtro por fecha
      let passesDateFilter = true;
      if (recentPickupsFilters.dateStart && recentPickupsFilters.dateEnd) {
        const filterStart = startOfDay(new Date(recentPickupsFilters.dateStart));
        const filterEnd = endOfDay(new Date(recentPickupsFilters.dateEnd));
        passesDateFilter = pickupDate >= filterStart && pickupDate <= filterEnd;
      } else if (recentPickupsFilters.dateStart) {
        const filterStart = startOfDay(new Date(recentPickupsFilters.dateStart));
        passesDateFilter = pickupDate >= filterStart;
      } else if (recentPickupsFilters.dateEnd) {
        const filterEnd = endOfDay(new Date(recentPickupsFilters.dateEnd));
        passesDateFilter = pickupDate <= filterEnd;
      }

      // Filtro por estudiante
      let passesStudentFilter = true;
      if (recentPickupsFilters.student) {
        const student = studentsWithCourses.find(s => s.id === log.student_id);
        const studentName = student ? student.full_name.toLowerCase() : '';
        passesStudentFilter = studentName.includes(recentPickupsFilters.student.toLowerCase());
      }

      // Filtro por curso
      let passesCourseFilter = true;
      if (recentPickupsFilters.course) {
        const student = studentsWithCourses.find(s => s.id === log.student_id);
        const course = courses.find(c => c.id === student?.course_id);
        passesCourseFilter = course ? course.name.toLowerCase().includes(recentPickupsFilters.course.toLowerCase()) : false;
      }

      // Filtro por relación de persona autorizada
      let passesRelationshipFilter = true;
      if (recentPickupsFilters.relationship) {
        const authorizedPerson = authorizedPersons.find(ap => ap.id === log.authorized_person_id);
        passesRelationshipFilter = authorizedPerson ? 
          authorizedPerson.relationship.toLowerCase().includes(recentPickupsFilters.relationship.toLowerCase()) : false;
      }

      return passesDateFilter && passesStudentFilter && passesCourseFilter && passesRelationshipFilter;
    })
    .sort((a, b) => new Date(b.pickup_timestamp).getTime() - new Date(a.pickup_timestamp).getTime())
    .slice(0, 20); // Mostrar hasta 20 resultados

  // Obtener listas únicas para los filtros
  const uniqueCourses = courses.map(c => c.name).sort();
  const uniqueRelationships = [...new Set(authorizedPersons.map(ap => ap.relationship))].sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reportes y Estadísticas</h2>
          <p className="text-gray-600">Análisis detallado de retiros de estudiantes</p>
        </div>
        <Button onClick={exportToCSV} className="flex items-center">
          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
          Exportar CSV
        </Button>
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Relationship distribution */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Retiros por Tipo de Persona Autorizada
            </h3>
            <ResponsiveContainer width="100%" height={450}>
              <PieChart margin={{ top: 20, right: 30, bottom: 80, left: 30 }}>
                <Pie
                  data={relationshipPickupData}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  label={({ percent }) => `${percent ? (percent * 100).toFixed(1) : 0}%`}
                  outerRadius={100}
                  innerRadius={35}
                  fill="#8884d8"
                  dataKey="count"
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {relationshipPickupData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} retiros`]}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={60}
                  wrapperStyle={{ paddingTop: '20px' }}
                  content={() => {
                    return (
                      <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {relationshipPickupData.map((item, index) => (
                          <div key={item.relationship} className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-sm"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm text-gray-700">
                              {item.relationship}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Hourly distribution */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Distribución de Retiros por Rangos de Hora
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={hourlyPickupData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="hour" 
                  angle={-45}
                  textAnchor="end"
                  height={90}
                  fontSize={11}
                />
                <YAxis 
                  allowDecimals={false}
                  domain={[0, 'dataMax']}
                  tickCount={6}
                />
                <Tooltip 
                  formatter={(value) => [
                    `${value} retiros`,
                    'Número de retiros'
                  ]}
                  labelFormatter={(label) => `Horario: ${label}`}
                />
                <Legend />
                <Line type="monotone" dataKey="pickups" stroke="#8B5CF6" name="Retiros" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent pickups table */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Retiros Recientes
            </h3>
            <button
              onClick={clearRecentPickupsFilters}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              title="Limpiar todos los filtros"
            >
              <XMarkIcon className="h-4 w-4" />
              <span>Limpiar Filtros</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="space-y-2">
                      <div>Fecha/Hora</div>
                      <div className="flex space-x-1">
                        <input
                          type="date"
                          value={recentPickupsFilters.dateStart}
                          onChange={(e) => setRecentPickupsFilters(prev => ({ ...prev, dateStart: e.target.value }))}
                          className="w-20 px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Desde"
                        />
                        <input
                          type="date"
                          value={recentPickupsFilters.dateEnd}
                          onChange={(e) => setRecentPickupsFilters(prev => ({ ...prev, dateEnd: e.target.value }))}
                          className="w-20 px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Hasta"
                        />
                      </div>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="space-y-2">
                      <div>Estudiante</div>
                      <input
                        type="text"
                        placeholder="Buscar nombre..."
                        value={recentPickupsFilters.student}
                        onChange={(e) => setRecentPickupsFilters(prev => ({ ...prev, student: e.target.value }))}
                        className="w-32 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="space-y-2">
                      <div>Curso</div>
                      <select
                        value={recentPickupsFilters.course}
                        onChange={(e) => setRecentPickupsFilters(prev => ({ ...prev, course: e.target.value }))}
                        className="w-32 px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Todos</option>
                        {uniqueCourses.map(course => (
                          <option key={course} value={course}>{course}</option>
                        ))}
                      </select>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="space-y-2">
                      <div>Persona Autorizada</div>
                      <select
                        value={recentPickupsFilters.relationship}
                        onChange={(e) => setRecentPickupsFilters(prev => ({ ...prev, relationship: e.target.value }))}
                        className="w-36 px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Todas</option>
                        {uniqueRelationships.map(relationship => (
                          <option key={relationship} value={relationship}>{relationship}</option>
                        ))}
                      </select>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="space-y-2">
                      <div>Registrado Por</div>
                      <div className="text-xs text-gray-400 italic">Sin filtro</div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecentPickups.map((log) => {
                  const student = studentsWithCourses.find(s => s.id === log.student_id);
                  const person = authorizedPersons.find(p => p.id === log.authorized_person_id);
                  
                  return (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(log.pickup_timestamp), 'dd/MM/yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student?.full_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {student?.course.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{person?.full_name}</div>
                          <div className="text-gray-500 text-xs">{person?.relationship}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.recorded_by_user}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredRecentPickups.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {(recentPickupsFilters.dateStart || recentPickupsFilters.dateEnd || 
                  recentPickupsFilters.student || recentPickupsFilters.course || 
                  recentPickupsFilters.relationship) 
                  ? "No se encontraron retiros con los filtros aplicados"
                  : "No hay retiros registrados"
                }
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
