'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { 
  Course, 
  Student, 
  AuthorizedPerson, 
  PickupLog, 
  Schedule,
  StudentWithCourse, 
  StudentWithAuthorizedPersons 
} from '@/types';
import { useSupabaseData } from '@/hooks/useSupabaseData';

interface DataContextType {
  // Data
  courses: Course[];
  students: Student[];
  authorizedPersons: AuthorizedPerson[];
  pickupLogs: PickupLog[];
  schedules: Schedule[];
  studentsWithCourses: StudentWithCourse[];
  loading: boolean;
  error: string | null;

  // Course operations
  addCourse: (course: Omit<Course, 'id'>) => Promise<Course>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;

  // Student operations
  addStudent: (student: Omit<Student, 'id' | 'status'>) => Promise<void>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  getStudentWithAuthorizedPersons: (studentId: string) => StudentWithAuthorizedPersons | null;

  // Authorized Person operations
  addAuthorizedPerson: (person: Omit<AuthorizedPerson, 'id'>) => Promise<void>;
  updateAuthorizedPerson: (id: string, person: Partial<AuthorizedPerson>) => Promise<void>;
  deleteAuthorizedPerson: (id: string) => Promise<void>;
  getAuthorizedPersonsByStudent: (studentId: string) => AuthorizedPerson[];

  // Pickup Log operations
  registerPickup: (studentId: string, authorizedPersonId: string, recordedBy: string) => Promise<void>;

  // Schedule operations
  addSchedule: (schedule: Omit<Schedule, 'id'>) => Promise<void>;
  updateSchedule: (id: number, schedule: Partial<Schedule>) => Promise<void>;
  deleteSchedule: (id: number) => Promise<void>;
  getSchedulesByCourse: (courseId: string) => Schedule[];
  getSchedulesByDay: (dayOfWeek: number) => Schedule[];
  
  // Utility functions
  resetDailyStatus: () => Promise<void>;
  searchStudents: (query: string) => StudentWithCourse[];
  refetch: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const supabaseData = useSupabaseData();

  const value: DataContextType = {
    // Data from Supabase
    courses: supabaseData.courses,
    students: supabaseData.students,
    authorizedPersons: supabaseData.authorizedPersons,
    pickupLogs: supabaseData.pickupLogs,
    schedules: supabaseData.schedules,
    studentsWithCourses: supabaseData.studentsWithCourses,
    loading: supabaseData.loading,
    error: supabaseData.error,

    // Course operations
    addCourse: supabaseData.addCourse,
    updateCourse: supabaseData.updateCourse,
    deleteCourse: supabaseData.deleteCourse,

    // Student operations
    addStudent: supabaseData.addStudent,
    updateStudent: supabaseData.updateStudent,
    deleteStudent: supabaseData.deleteStudent,
    getStudentWithAuthorizedPersons: supabaseData.getStudentWithAuthorizedPersons,

    // Authorized Person operations
    addAuthorizedPerson: supabaseData.addAuthorizedPerson,
    updateAuthorizedPerson: supabaseData.updateAuthorizedPerson,
    deleteAuthorizedPerson: supabaseData.deleteAuthorizedPerson,
    getAuthorizedPersonsByStudent: supabaseData.getAuthorizedPersonsByStudent,

    // Pickup Log operations
    registerPickup: supabaseData.registerPickup,

    // Schedule operations
    addSchedule: supabaseData.addSchedule,
    updateSchedule: supabaseData.updateSchedule,
    deleteSchedule: supabaseData.deleteSchedule,
    getSchedulesByCourse: supabaseData.getSchedulesByCourse,
    getSchedulesByDay: supabaseData.getSchedulesByDay,

    // Utility functions
    resetDailyStatus: supabaseData.resetDailyStatus,
    searchStudents: supabaseData.searchStudents,
    refetch: supabaseData.refetch
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
