'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Course, 
  Student, 
  AuthorizedPerson, 
  PickupLog, 
  StudentWithCourse, 
  StudentWithAuthorizedPersons 
} from '@/types';
import { SyncManager } from '@/lib/sync';
import { useSupabaseStudents } from '@/hooks/useSupabaseStudents';

interface DataContextType {
  // Courses
  courses: Course[];
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  // Students
  students: Student[];
  studentsWithCourses: StudentWithCourse[];
  addStudent: (student: Omit<Student, 'id' | 'status'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  getStudentWithAuthorizedPersons: (studentId: string) => StudentWithAuthorizedPersons | null;

  // Authorized Persons
  authorizedPersons: AuthorizedPerson[];
  addAuthorizedPerson: (person: Omit<AuthorizedPerson, 'id'>) => void;
  updateAuthorizedPerson: (id: string, person: Partial<AuthorizedPerson>) => void;
  deleteAuthorizedPerson: (id: string) => void;
  getAuthorizedPersonsByStudent: (studentId: string) => AuthorizedPerson[];

  // Pickup Logs
  pickupLogs: PickupLog[];
  registerPickup: (studentId: string, authorizedPersonId: string, recordedBy: string) => void;
  
  // Utility functions
  resetDailyStatus: () => void;
  searchStudents: (query: string) => StudentWithCourse[];
  
  // Supabase sync status
  supabaseSyncStatus: 'idle' | 'syncing' | 'error' | 'success';
  lastSupabaseSyncTime: Date | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Mock data for demonstration
const MOCK_COURSES: Course[] = [
  { id: '1', name: '1° BÁSICO A' },
  { id: '2', name: '1° BÁSICO B' },
  { id: '3', name: '2° BÁSICO A' },
  { id: '4', name: '3° BÁSICO A' },
  { id: '5', name: '4° BÁSICO A' },
];

const MOCK_STUDENTS: Student[] = [
  { id: '1', full_name: 'Ana García López', course_id: '1', status: 'Presente', rut_passport: '12345678-9' },
  { id: '2', full_name: 'Carlos Rodríguez Silva', course_id: '1', status: 'Presente', rut_passport: '23456789-0' },
  { id: '3', full_name: 'María Fernández Torres', course_id: '2', status: 'Presente', rut_passport: '34567890-1' },
  { id: '4', full_name: 'José Martínez Ruiz', course_id: '2', status: 'Retirado', rut_passport: '45678901-2' },
  { id: '5', full_name: 'Sofía González Pérez', course_id: '3', status: 'Presente', rut_passport: '56789012-3' },
];

const MOCK_AUTHORIZED_PERSONS: AuthorizedPerson[] = [
  { id: '1', full_name: 'Carmen López Morales', relationship: 'Madre', student_id: '1' },
  { id: '2', full_name: 'Ricardo García Hernández', relationship: 'Padre', student_id: '1' },
  { id: '3', full_name: 'Elena Silva Castro', relationship: 'Madre', student_id: '2' },
  { id: '4', full_name: 'Patricia Torres Vega', relationship: 'Abuela', student_id: '3' },
  { id: '5', full_name: 'Andrea Ruiz Montenegro', relationship: 'Madre', student_id: '4' },
];

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // Initialize sync manager
  const syncManager = SyncManager.getInstance();
  
  // Initialize Supabase hook
  const {
    syncStatus: supabaseSyncStatus,
    lastSyncTime: lastSupabaseSyncTime,
    syncStudentsToSupabase,
    upsertStudentToSupabase,
    deleteStudentFromSupabase
  } = useSupabaseStudents({ enableSync: true });

  // Initialize state with synced data or fallback to mock data
  const [courses, setCourses] = useState<Course[]>(() => {
    const synced = syncManager.getSyncedData('courses');
    return synced || MOCK_COURSES;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const synced = syncManager.getSyncedData('students');
    return synced || MOCK_STUDENTS;
  });

  const [authorizedPersons, setAuthorizedPersons] = useState<AuthorizedPerson[]>(() => {
    const synced = syncManager.getSyncedData('authorizedPersons');
    return synced || MOCK_AUTHORIZED_PERSONS;
  });

  const [pickupLogs, setPickupLogs] = useState<PickupLog[]>(() => {
    const synced = syncManager.getSyncedData('pickupLogs');
    return synced || [];
  });

  // Set up sync listeners
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    // Subscribe to courses changes
    unsubscribers.push(
      syncManager.subscribe('courses', (data: unknown) => {
        const newCourses = data as Course[];
        setCourses(newCourses);
      })
    );

    // Subscribe to students changes
    unsubscribers.push(
      syncManager.subscribe('students', (data: unknown) => {
        const newStudents = data as Student[];
        setStudents(newStudents);
      })
    );

    // Subscribe to authorized persons changes
    unsubscribers.push(
      syncManager.subscribe('authorizedPersons', (data: unknown) => {
        const newPersons = data as AuthorizedPerson[];
        setAuthorizedPersons(newPersons);
      })
    );

    // Subscribe to pickup logs changes
    unsubscribers.push(
      syncManager.subscribe('pickupLogs', (data: unknown) => {
        const newLogs = data as PickupLog[];
        setPickupLogs(newLogs);
      })
    );

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [syncManager]);

  // Reset student status daily at 4 AM
  useEffect(() => {
    const resetTime = () => {
      const now = new Date();
      const resetHour = 4; // 4 AM
      const nextReset = new Date(now);
      nextReset.setHours(resetHour, 0, 0, 0);
      
      if (now.getHours() >= resetHour) {
        nextReset.setDate(nextReset.getDate() + 1);
      }
      
      return nextReset.getTime() - now.getTime();
    };

    const timeoutId = setTimeout(() => {
      resetDailyStatus();
      // Set up daily interval
      const intervalId = setInterval(resetDailyStatus, 24 * 60 * 60 * 1000);
      return () => clearInterval(intervalId);
    }, resetTime());

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initial Supabase sync - sync current students to Supabase on first load
  useEffect(() => {
    if (students.length > 0) {
      console.log('🔄 Iniciando sincronización inicial con Supabase...');
      syncStudentsToSupabase(students);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar el componente

  // Computed values
  const studentsWithCourses: StudentWithCourse[] = students.map(student => ({
    ...student,
    course: courses.find(course => course.id === student.course_id)!
  }));

  // Course management with sync
  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString(),
    };
    const updatedCourses = [...courses, newCourse];
    setCourses(updatedCourses);
    syncManager.broadcast('courses', updatedCourses);
  };

  const updateCourse = (id: string, courseData: Partial<Course>) => {
    const updatedCourses = courses.map(course => 
      course.id === id ? { ...course, ...courseData } : course
    );
    setCourses(updatedCourses);
    syncManager.broadcast('courses', updatedCourses);
  };

  const deleteCourse = (id: string) => {
    const updatedCourses = courses.filter(course => course.id !== id);
    setCourses(updatedCourses);
    syncManager.broadcast('courses', updatedCourses);
    
    // Also remove students from deleted course
    const updatedStudents = students.filter(student => student.course_id !== id);
    setStudents(updatedStudents);
    syncManager.broadcast('students', updatedStudents);
  };

  // Student management with sync
  const addStudent = (studentData: Omit<Student, 'id' | 'status'>) => {
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString(),
      status: 'Presente',
    };
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    syncManager.broadcast('students', updatedStudents);
    
    // Sync to Supabase
    upsertStudentToSupabase(newStudent);
  };

  const updateStudent = (id: string, studentData: Partial<Student>) => {
    const updatedStudents = students.map(student => 
      student.id === id ? { ...student, ...studentData } : student
    );
    setStudents(updatedStudents);
    syncManager.broadcast('students', updatedStudents);
    
    // Sync to Supabase
    const updatedStudent = updatedStudents.find(s => s.id === id);
    if (updatedStudent) {
      upsertStudentToSupabase(updatedStudent);
    }
  };

  const deleteStudent = (id: string) => {
    const updatedStudents = students.filter(student => student.id !== id);
    setStudents(updatedStudents);
    syncManager.broadcast('students', updatedStudents);
    
    // Sync to Supabase
    deleteStudentFromSupabase(id);
    
    // Also remove authorized persons for deleted student
    const updatedPersons = authorizedPersons.filter(person => person.student_id !== id);
    setAuthorizedPersons(updatedPersons);
    syncManager.broadcast('authorizedPersons', updatedPersons);
  };

  const getStudentWithAuthorizedPersons = (studentId: string): StudentWithAuthorizedPersons | null => {
    const student = students.find(s => s.id === studentId);
    if (!student) return null;

    const course = courses.find(c => c.id === student.course_id);
    if (!course) return null;

    const studentAuthorizedPersons = authorizedPersons.filter(p => p.student_id === studentId);

    return {
      ...student,
      course,
      authorizedPersons: studentAuthorizedPersons,
    };
  };

  // Authorized persons management with sync
  const addAuthorizedPerson = (personData: Omit<AuthorizedPerson, 'id'>) => {
    const newPerson: AuthorizedPerson = {
      ...personData,
      id: Date.now().toString(),
    };
    const updatedPersons = [...authorizedPersons, newPerson];
    setAuthorizedPersons(updatedPersons);
    syncManager.broadcast('authorizedPersons', updatedPersons);
  };

  const updateAuthorizedPerson = (id: string, personData: Partial<AuthorizedPerson>) => {
    const updatedPersons = authorizedPersons.map(person => 
      person.id === id ? { ...person, ...personData } : person
    );
    setAuthorizedPersons(updatedPersons);
    syncManager.broadcast('authorizedPersons', updatedPersons);
  };

  const deleteAuthorizedPerson = (id: string) => {
    const updatedPersons = authorizedPersons.filter(person => person.id !== id);
    setAuthorizedPersons(updatedPersons);
    syncManager.broadcast('authorizedPersons', updatedPersons);
  };

  const getAuthorizedPersonsByStudent = (studentId: string): AuthorizedPerson[] => {
    return authorizedPersons.filter(person => person.student_id === studentId);
  };

  // Pickup management with sync
  const registerPickup = (studentId: string, authorizedPersonId: string, recordedBy: string) => {
    // Create pickup log
    const newPickupLog: PickupLog = {
      id: Date.now(),
      student_id: studentId,
      authorized_person_id: authorizedPersonId,
      pickup_timestamp: new Date(),
      recorded_by_user: recordedBy,
    };
    const updatedLogs = [...pickupLogs, newPickupLog];
    setPickupLogs(updatedLogs);
    syncManager.broadcast('pickupLogs', updatedLogs);

    // Update student status
    updateStudent(studentId, { status: 'Retirado' });
  };

  // Utility functions
  const resetDailyStatus = () => {
    const updatedStudents = students.map(student => ({ ...student, status: 'Presente' as const }));
    setStudents(updatedStudents);
    syncManager.broadcast('students', updatedStudents);
  };

  const searchStudents = (query: string): StudentWithCourse[] => {
    if (!query.trim()) return studentsWithCourses;
    
    const lowercaseQuery = query.toLowerCase();
    return studentsWithCourses.filter(student =>
      student.full_name.toLowerCase().includes(lowercaseQuery) ||
      student.course.name.toLowerCase().includes(lowercaseQuery)
    );
  };

  const value: DataContextType = {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    students,
    studentsWithCourses,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentWithAuthorizedPersons,
    authorizedPersons,
    addAuthorizedPerson,
    updateAuthorizedPerson,
    deleteAuthorizedPerson,
    getAuthorizedPersonsByStudent,
    pickupLogs,
    registerPickup,
    resetDailyStatus,
    searchStudents,
    supabaseSyncStatus,
    lastSupabaseSyncTime,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
