'use client';

import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, Button, Input, Modal } from '../ui';
import { Schedule, Course } from '@/types';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ClockIcon,
  CalendarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export const ScheduleManagement: React.FC = () => {
  const { 
    courses, 
    schedules, 
    addCourse,
    updateCourse,
    deleteCourse,
    addSchedule, 
    updateSchedule, 
    deleteSchedule 
  } = useData();
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<number>(0); // 0 = all days
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [scheduleForm, setScheduleForm] = useState({
    course_id: '',
    day_of_week: 1,
    start_time: '',
    end_time: '',
    subject: ''
  });

  const [courseForm, setCourseForm] = useState({
    name: '',
    createSchedules: false, // Nueva opción para crear horarios automáticamente
    schedules: [] as Array<{
      day_of_week: number;
      start_time: string;
      end_time: string;
      subject: string;
    }>
  });

  const dayNames = [
    { id: 0, name: 'Todos los días', short: 'Todos' },
    { id: 1, name: 'Lunes', short: 'Lun' },
    { id: 2, name: 'Martes', short: 'Mar' },
    { id: 3, name: 'Miércoles', short: 'Mié' },
    { id: 4, name: 'Jueves', short: 'Jue' },
    { id: 5, name: 'Viernes', short: 'Vie' },
  ];

  const subjects = [
    'Matemática', 'Lenguaje', 'Ciencias', 'Historia', 'Ed. Física', 
    'Inglés', 'Arte', 'Música', 'Tecnología', 'Religión'
  ];

  // Filter schedules based on selected course and day
  const filteredSchedules = schedules.filter(schedule => {
    const courseMatch = selectedCourse === 'all' || schedule.course_id === selectedCourse;
    const dayMatch = selectedDay === 0 || schedule.day_of_week === selectedDay;
    return courseMatch && dayMatch;
  });

  // Group schedules by course and day for better visualization
  const groupedSchedules = filteredSchedules.reduce((acc, schedule) => {
    const key = `${schedule.course_id}-${schedule.day_of_week}`;
    if (!acc[key]) {
      acc[key] = {
        course: courses.find(c => c.id === schedule.course_id)!,
        day: schedule.day_of_week,
        schedules: []
      };
    }
    acc[key].schedules.push(schedule);
    acc[key].schedules.sort((a, b) => a.start_time.localeCompare(b.start_time));
    return acc;
  }, {} as Record<string, { course: Course; day: number; schedules: Schedule[] }>);

  const handleAddSchedule = () => {
    setEditingSchedule(null);
    setScheduleForm({
      course_id: '',
      day_of_week: 1,
      start_time: '',
      end_time: '',
      subject: ''
    });
    setIsScheduleModalOpen(true);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setScheduleForm({
      course_id: schedule.course_id,
      day_of_week: schedule.day_of_week,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      subject: schedule.subject
    });
    setIsScheduleModalOpen(true);
  };

  const handleDeleteSchedule = async (scheduleId: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este horario?')) {
      try {
        await deleteSchedule(scheduleId);
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    }
  };

  const handleSaveSchedule = async () => {
    if (!scheduleForm.course_id || !scheduleForm.start_time || !scheduleForm.end_time || !scheduleForm.subject) {
      return;
    }

    try {
      if (editingSchedule) {
        await updateSchedule(editingSchedule.id, scheduleForm);
      } else {
        await addSchedule(scheduleForm);
      }

      setIsScheduleModalOpen(false);
      setScheduleForm({
        course_id: '',
        day_of_week: 1,
        start_time: '',
        end_time: '',
        subject: ''
      });
      setEditingSchedule(null);
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  // Course management functions
  const handleAddCourse = () => {
    setEditingCourse(null);
    setCourseForm({
      name: '',
      createSchedules: false,
      schedules: []
    });
    setIsCourseModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      name: course.name,
      createSchedules: false,
      schedules: []
    });
    setIsCourseModalOpen(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este curso? También se eliminarán todos sus horarios asociados.')) {
      try {
        await deleteCourse(courseId);
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleSaveCourse = async () => {
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, { name: courseForm.name });
      } else {
        const newCourse = await addCourse({ name: courseForm.name });
        
        // Si el usuario eligió crear horarios automáticamente
        if (courseForm.createSchedules && courseForm.schedules.length > 0) {
          console.log('Creating schedules for course:', newCourse.id, courseForm.schedules);
          for (const schedule of courseForm.schedules) {
            await addSchedule({
              course_id: newCourse.id,
              day_of_week: schedule.day_of_week,
              start_time: schedule.start_time,
              end_time: schedule.end_time,
              subject: schedule.subject
            });
          }
        }
      }

      setIsCourseModalOpen(false);
      setCourseForm({
        name: '',
        createSchedules: false,
        schedules: []
      });
      setEditingCourse(null);
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const addScheduleToCourse = () => {
    setCourseForm(prev => ({
      ...prev,
      schedules: [...prev.schedules, {
        day_of_week: 1,
        start_time: '',
        end_time: '',
        subject: ''
      }]
    }));
  };

  const removeScheduleFromCourse = (index: number) => {
    setCourseForm(prev => ({
      ...prev,
      schedules: prev.schedules.filter((_, i) => i !== index)
    }));
  };

  const updateCourseSchedule = (index: number, field: string, value: string | number) => {
    setCourseForm(prev => ({
      ...prev,
      schedules: prev.schedules.map((schedule, i) => 
        i === index ? { ...schedule, [field]: value } : schedule
      )
    }));
  };

  const getDayName = (dayNumber: number) => {
    return dayNames.find(d => d.id === dayNumber)?.name || '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Cursos y Horarios</h2>
          <p className="text-gray-600">Administra cursos y sus horarios de clases</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleAddCourse} className="flex items-center" variant="secondary">
            <AcademicCapIcon className="h-5 w-5 mr-2" />
            Nuevo Curso
          </Button>
          <Button onClick={handleAddSchedule} className="flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            Agregar Horario
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curso
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos los cursos</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Día de la Semana
              </label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(Number(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {dayNames.map(day => (
                  <option key={day.id} value={day.id}>{day.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Courses Management Section */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <AcademicCapIcon className="h-5 w-5 mr-2 text-blue-600" />
            Cursos Disponibles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{course.name}</h4>
                    <p className="text-sm text-gray-500">
                      {schedules.filter(s => s.course_id === course.id).length} horarios
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditCourse(course)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="Editar curso"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Eliminar curso"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {courses.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No hay cursos registrados. 
                <button 
                  onClick={handleAddCourse}
                  className="text-blue-600 hover:text-blue-800 ml-1"
                >
                  Crear el primero
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.values(groupedSchedules).map(({ course, day, schedules: daySchedules }) => (
          <Card key={`${course.id}-${day}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
                    <p className="text-sm text-gray-600">{getDayName(day)}</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {daySchedules.length} clases
                </span>
              </div>

              <div className="space-y-3">
                {daySchedules.map(schedule => (
                  <div key={schedule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {schedule.start_time} - {schedule.end_time}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {schedule.subject}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEditSchedule(schedule)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteSchedule(schedule.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {daySchedules.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No hay horarios programados
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {Object.keys(groupedSchedules).length === 0 && (
        <Card>
          <div className="p-8 text-center">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay horarios disponibles
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedCourse !== 'all' || selectedDay !== 0 
                ? 'No se encontraron horarios con los filtros seleccionados'
                : 'Comienza agregando horarios de clases para los cursos'
              }
            </p>
            <Button onClick={handleAddSchedule}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Agregar Primer Horario
            </Button>
          </div>
        </Card>
      )}

      {/* Schedule Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title={editingSchedule ? 'Editar Horario' : 'Agregar Horario'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Curso
            </label>
            <select
              value={scheduleForm.course_id}
              onChange={(e) => setScheduleForm({ ...scheduleForm, course_id: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar curso</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Día de la Semana
            </label>
            <select
              value={scheduleForm.day_of_week}
              onChange={(e) => setScheduleForm({ ...scheduleForm, day_of_week: Number(e.target.value) })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {dayNames.slice(1).map(day => (
                <option key={day.id} value={day.id}>{day.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Hora Inicio"
              type="time"
              value={scheduleForm.start_time}
              onChange={(e) => setScheduleForm({ ...scheduleForm, start_time: e.target.value })}
            />
            <Input
              label="Hora Fin"
              type="time"
              value={scheduleForm.end_time}
              onChange={(e) => setScheduleForm({ ...scheduleForm, end_time: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asignatura
            </label>
            <select
              value={scheduleForm.subject}
              onChange={(e) => setScheduleForm({ ...scheduleForm, subject: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar asignatura</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsScheduleModalOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveSchedule}
              disabled={!scheduleForm.course_id || !scheduleForm.start_time || !scheduleForm.end_time || !scheduleForm.subject}
            >
              {editingSchedule ? 'Actualizar' : 'Agregar'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Course Modal */}
      <Modal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        title={editingCourse ? 'Editar Curso' : 'Nuevo Curso'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Curso
            </label>
            <Input
              type="text"
              value={courseForm.name}
              onChange={(e) => setCourseForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ej: 1° BÁSICO A, IV B"
              className="w-full"
            />
          </div>

          {!editingCourse && (
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="createSchedules"
                  checked={courseForm.createSchedules}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, createSchedules: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="createSchedules" className="ml-2 block text-sm text-gray-900">
                  Crear horarios para este curso
                </label>
              </div>

              {courseForm.createSchedules && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">Horarios del Curso</h4>
                    <Button onClick={addScheduleToCourse} size="sm" variant="secondary">
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Agregar Horario
                    </Button>
                  </div>

                  {courseForm.schedules.map((schedule, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium text-gray-700">Horario {index + 1}</h5>
                        <button
                          onClick={() => removeScheduleFromCourse(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Día
                          </label>
                          <select
                            value={schedule.day_of_week}
                            onChange={(e) => updateCourseSchedule(index, 'day_of_week', Number(e.target.value))}
                            className="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            {dayNames.slice(1).map(day => (
                              <option key={day.id} value={day.id}>{day.short}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Asignatura
                          </label>
                          <select
                            value={schedule.subject}
                            onChange={(e) => updateCourseSchedule(index, 'subject', e.target.value)}
                            className="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Seleccionar</option>
                            {subjects.map(subject => (
                              <option key={subject} value={subject}>{subject}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Hora Inicio
                          </label>
                          <input
                            type="time"
                            value={schedule.start_time}
                            onChange={(e) => updateCourseSchedule(index, 'start_time', e.target.value)}
                            className="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Hora Fin
                          </label>
                          <input
                            type="time"
                            value={schedule.end_time}
                            onChange={(e) => updateCourseSchedule(index, 'end_time', e.target.value)}
                            className="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsCourseModalOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveCourse}
              disabled={!courseForm.name}
            >
              {editingCourse ? 'Actualizar' : 'Crear Curso'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
