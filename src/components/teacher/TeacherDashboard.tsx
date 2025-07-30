'use client';

import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { TeacherLayout } from './TeacherLayout';
import { StudentPickupModal } from './StudentPickupModal';
import { Card } from '../ui';
import { 
  ChevronDownIcon, 
  ChevronUpIcon,
  UserIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { StudentWithCourse, StudentWithAuthorizedPersons } from '@/types';

export const TeacherDashboard: React.FC = () => {
  const { courses, studentsWithCourses, searchStudents, getStudentWithAuthorizedPersons } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithAuthorizedPersons | null>(null);

  // Get students based on search
  const displayStudents = searchQuery ? searchStudents(searchQuery) : studentsWithCourses;

  // Group students by course
  const studentsByCourse = courses.map(course => ({
    course,
    students: displayStudents.filter(student => student.course_id === course.id)
  })).filter(group => group.students.length > 0);

  const toggleCourse = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const handleStudentClick = (student: StudentWithCourse) => {
    // Get the full student data with authorized persons from Supabase
    const studentWithPersons = getStudentWithAuthorizedPersons(student.id);
    if (studentWithPersons) {
      setSelectedStudent(studentWithPersons);
    }
  };

  return (
    <>
      <TeacherLayout 
        showSearch 
        onSearch={setSearchQuery}
        searchValue={searchQuery}
      >
        <div className="space-y-4">
          {/* Summary stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Card className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {displayStudents.filter(s => s.status === 'Presente').length}
              </p>
              <p className="text-sm text-gray-600">Presentes</p>
            </Card>
            <Card className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {displayStudents.filter(s => s.status === 'Retirado').length}
              </p>
              <p className="text-sm text-gray-600">Retirados</p>
            </Card>
          </div>

          {/* Course listings */}
          {searchQuery ? (
            /* Search results */
            <Card>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-3">
                  Resultados de búsqueda ({displayStudents.length})
                </h3>
                <div className="space-y-3">
                  {displayStudents.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => handleStudentClick(student)}
                      className={`
                        flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors touch-manipulation
                        ${student.status === 'Retirado' 
                          ? 'bg-gray-50 border-gray-200 opacity-60' 
                          : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100'
                        }
                      `}
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm sm:text-base truncate ${student.status === 'Retirado' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {student.full_name}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">{student.course.name}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <span className={`
                          inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                          ${student.status === 'Presente' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                          }
                        `}>
                          {student.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            /* Course-grouped view */
            <div className="space-y-4">
              {studentsByCourse.map(({ course, students }) => {
                const isExpanded = expandedCourse === course.id;
                const presentCount = students.filter(s => s.status === 'Presente').length;
                const totalCount = students.length;

                return (
                  <Card key={course.id}>
                    <div 
                      className="p-4 cursor-pointer"
                      onClick={() => toggleCourse(course.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {course.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {presentCount} de {totalCount} presentes
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {presentCount} presentes
                              </span>
                              {totalCount - presentCount > 0 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {totalCount - presentCount} retirados
                                </span>
                              )}
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-gray-200">
                        <div className="p-4 space-y-3">
                          {students.map((student) => (
                            <div
                              key={student.id}
                              onClick={() => handleStudentClick(student)}
                              className={`
                                flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors touch-manipulation
                                ${student.status === 'Retirado' 
                                  ? 'bg-gray-50 border-gray-200 opacity-60' 
                                  : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100'
                                }
                              `}
                            >
                              <div className="flex-1 min-w-0">
                                <h4 className={`font-medium text-sm sm:text-base truncate ${student.status === 'Retirado' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                  {student.full_name}
                                </h4>
                              </div>
                              <div className="text-right flex-shrink-0 ml-3">
                                <span className={`
                                  inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                  ${student.status === 'Presente' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                  }
                                `}>
                                  {student.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}

          {displayStudents.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-gray-500">
                {searchQuery ? 'No se encontraron estudiantes' : 'No hay estudiantes disponibles'}
              </p>
            </Card>
          )}
        </div>
      </TeacherLayout>

      {/* Pickup Modal */}
      {selectedStudent && (
        <StudentPickupModal
          student={selectedStudent}
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </>
  );
};
