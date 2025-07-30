import { useState, useEffect } from 'react';
import { supabase, logSupabaseOperation } from '@/lib/supabase';
import { 
  Course, 
  Student, 
  AuthorizedPerson, 
  PickupLog,
  Schedule,
  StudentWithCourse,
  StudentWithAuthorizedPersons 
} from '@/types';

export const useSupabaseData = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [authorizedPersons, setAuthorizedPersons] = useState<AuthorizedPerson[]>([]);
  const [pickupLogs, setPickupLogs] = useState<PickupLog[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data from Supabase
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('name');

      if (coursesError) throw coursesError;

      // Fetch students
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .order('full_name');

      if (studentsError) throw studentsError;

      console.log('📊 Students fetched from Supabase:', studentsData?.map(s => ({id: s.id, name: s.full_name, status: s.status})));

      // Fetch authorized persons
      const { data: personsData, error: personsError } = await supabase
        .from('authorized_persons')
        .select('*')
        .order('full_name');

      if (personsError) throw personsError;

      // Fetch pickup logs
      const { data: logsData, error: logsError } = await supabase
        .from('pickup_logs')
        .select('*')
        .order('pickup_timestamp', { ascending: false });

      if (logsError) throw logsError;

      // Fetch schedules
      const { data: schedulesData, error: schedulesError } = await supabase
        .from('schedules')
        .select('*')
        .order('day_of_week, start_time');

      if (schedulesError) throw schedulesError;

      // Set state
      setCourses(coursesData || []);
      setStudents(studentsData || []);
      setAuthorizedPersons(personsData || []);
      setPickupLogs((logsData || []).map(log => ({
        ...log,
        pickup_timestamp: new Date(log.pickup_timestamp)
      })));
      setSchedules(schedulesData || []);

      logSupabaseOperation('FETCH_ALL_DATA_SUCCESS', {
        courses: coursesData?.length,
        students: studentsData?.length,
        persons: personsData?.length,
        logs: logsData?.length,
        schedules: schedulesData?.length
      });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      logSupabaseOperation('FETCH_ALL_DATA_ERROR', null, error);
    } finally {
      setLoading(false);
    }
  };

  // Course operations
  const addCourse = async (courseData: Omit<Course, 'id'>) => {
    try {
      const newCourse = {
        id: Date.now().toString(),
        ...courseData
      };

      const { data, error } = await supabase
        .from('courses')
        .insert(newCourse)
        .select()
        .single();

      if (error) throw error;

      setCourses(prev => [...prev, data]);
      logSupabaseOperation('ADD_COURSE_SUCCESS', { courseId: data.id });
      return data; // Retornar el curso creado
    } catch (error: unknown) {
      logSupabaseOperation('ADD_COURSE_ERROR', null, error);
      throw error;
    }
  };

  const updateCourse = async (id: string, courseData: Partial<Course>) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCourses(prev => prev.map(course => 
        course.id === id ? { ...course, ...data } : course
      ));
      logSupabaseOperation('UPDATE_COURSE_SUCCESS', { courseId: id });
    } catch (error: unknown) {
      logSupabaseOperation('UPDATE_COURSE_ERROR', null, error);
      throw error;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCourses(prev => prev.filter(course => course.id !== id));
      logSupabaseOperation('DELETE_COURSE_SUCCESS', { courseId: id });
    } catch (error: unknown) {
      logSupabaseOperation('DELETE_COURSE_ERROR', null, error);
      throw error;
    }
  };

  // Student operations
  const addStudent = async (studentData: Omit<Student, 'id' | 'status'>) => {
    try {
      const newStudent = {
        id: Date.now().toString(),
        ...studentData,
        status: 'Presente' as const
      };

      const { data, error } = await supabase
        .from('students')
        .insert(newStudent)
        .select()
        .single();

      if (error) throw error;

      setStudents(prev => [...prev, data]);
      logSupabaseOperation('ADD_STUDENT_SUCCESS', { studentId: data.id });
    } catch (error: unknown) {
      logSupabaseOperation('ADD_STUDENT_ERROR', null, error);
      throw error;
    }
  };

  const updateStudent = async (id: string, studentData: Partial<Student>) => {
    try {
      console.log('🔄 Updating student:', id, 'with data:', studentData);
      
      const { data, error } = await supabase
        .from('students')
        .update(studentData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setStudents(prev => {
        const updated = prev.map(student => 
          student.id === id ? { ...student, ...data } : student
        );
        console.log('✅ Student updated in state:', updated.find(s => s.id === id));
        return updated;
      });
      logSupabaseOperation('UPDATE_STUDENT_SUCCESS', { studentId: id });
    } catch (error: unknown) {
      logSupabaseOperation('UPDATE_STUDENT_ERROR', null, error);
      throw error;
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStudents(prev => prev.filter(student => student.id !== id));
      logSupabaseOperation('DELETE_STUDENT_SUCCESS', { studentId: id });
    } catch (error: unknown) {
      logSupabaseOperation('DELETE_STUDENT_ERROR', null, error);
      throw error;
    }
  };

  // Authorized Person operations
  const addAuthorizedPerson = async (personData: Omit<AuthorizedPerson, 'id'>) => {
    try {
      const newPerson = {
        id: Date.now().toString(),
        ...personData
      };

      const { data, error } = await supabase
        .from('authorized_persons')
        .insert(newPerson)
        .select()
        .single();

      if (error) throw error;

      setAuthorizedPersons(prev => [...prev, data]);
      logSupabaseOperation('ADD_AUTHORIZED_PERSON_SUCCESS', { personId: data.id });
    } catch (error: unknown) {
      logSupabaseOperation('ADD_AUTHORIZED_PERSON_ERROR', null, error);
      throw error;
    }
  };

  const updateAuthorizedPerson = async (id: string, personData: Partial<AuthorizedPerson>) => {
    try {
      const { data, error } = await supabase
        .from('authorized_persons')
        .update(personData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setAuthorizedPersons(prev => prev.map(person => 
        person.id === id ? { ...person, ...data } : person
      ));
      logSupabaseOperation('UPDATE_AUTHORIZED_PERSON_SUCCESS', { personId: id });
    } catch (error: unknown) {
      logSupabaseOperation('UPDATE_AUTHORIZED_PERSON_ERROR', null, error);
      throw error;
    }
  };

  const deleteAuthorizedPerson = async (id: string) => {
    try {
      const { error } = await supabase
        .from('authorized_persons')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAuthorizedPersons(prev => prev.filter(person => person.id !== id));
      logSupabaseOperation('DELETE_AUTHORIZED_PERSON_SUCCESS', { personId: id });
    } catch (error: unknown) {
      logSupabaseOperation('DELETE_AUTHORIZED_PERSON_ERROR', null, error);
      throw error;
    }
  };

  // Pickup Log operations
  const registerPickup = async (studentId: string, authorizedPersonId: string, recordedBy: string) => {
    try {
      const { data, error } = await supabase
        .from('pickup_logs')
        .insert({
          student_id: studentId,
          authorized_person_id: authorizedPersonId,
          recorded_by_user: recordedBy,
          pickup_timestamp: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Update student status to 'Retirado'
      console.log('📝 Setting student status to Retirado for student:', studentId);
      await updateStudent(studentId, { status: 'Retirado' });

      const newLog = {
        ...data,
        pickup_timestamp: new Date(data.pickup_timestamp)
      };

      setPickupLogs(prev => [newLog, ...prev]);
      logSupabaseOperation('REGISTER_PICKUP_SUCCESS', { studentId, authorizedPersonId });
    } catch (error: unknown) {
      logSupabaseOperation('REGISTER_PICKUP_ERROR', null, error);
      throw error;
    }
  };

  // Schedule operations
  const addSchedule = async (scheduleData: Omit<Schedule, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .insert(scheduleData)
        .select()
        .single();

      if (error) throw error;

      setSchedules(prev => [...prev, data]);
      logSupabaseOperation('ADD_SCHEDULE_SUCCESS', { scheduleId: data.id });
    } catch (error: unknown) {
      logSupabaseOperation('ADD_SCHEDULE_ERROR', null, error);
      throw error;
    }
  };

  const updateSchedule = async (scheduleId: number, scheduleData: Partial<Omit<Schedule, 'id'>>) => {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .update(scheduleData)
        .eq('id', scheduleId)
        .select()
        .single();

      if (error) throw error;

      setSchedules(prev => prev.map(schedule => 
        schedule.id === scheduleId ? data : schedule
      ));
      logSupabaseOperation('UPDATE_SCHEDULE_SUCCESS', { scheduleId });
    } catch (error: unknown) {
      logSupabaseOperation('UPDATE_SCHEDULE_ERROR', null, error);
      throw error;
    }
  };

  const deleteSchedule = async (scheduleId: number) => {
    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', scheduleId);

      if (error) throw error;

      setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
      logSupabaseOperation('DELETE_SCHEDULE_SUCCESS', { scheduleId });
    } catch (error: unknown) {
      logSupabaseOperation('DELETE_SCHEDULE_ERROR', null, error);
      throw error;
    }
  };

  const getSchedulesByCourse = (courseId: string) => {
    return schedules.filter(schedule => schedule.course_id === courseId);
  };

  const getSchedulesByDay = (dayOfWeek: number) => {
    return schedules.filter(schedule => schedule.day_of_week === dayOfWeek);
  };

  // Utility functions
  const resetDailyStatus = async () => {
    try {
      console.log('🔄 RESET_DAILY_STATUS called - Current students before reset:', students.map(s => ({id: s.id, name: s.full_name, status: s.status})));
      
      const { error } = await supabase
        .from('students')
        .update({ status: 'Presente' })
        .neq('status', 'Presente');

      if (error) throw error;

      setStudents(prev => {
        const updated = prev.map(student => ({ ...student, status: 'Presente' as const }));
        console.log('✅ Students updated to Presente:', updated.map(s => ({id: s.id, name: s.full_name, status: s.status})));
        return updated;
      });
      logSupabaseOperation('RESET_DAILY_STATUS_SUCCESS');
    } catch (error: unknown) {
      console.error('❌ Error in resetDailyStatus:', error);
      logSupabaseOperation('RESET_DAILY_STATUS_ERROR', null, error);
      throw error;
    }
  };

  // Computed values
  const studentsWithCourses: StudentWithCourse[] = students.map(student => ({
    ...student,
    course: courses.find(course => course.id === student.course_id)!
  }));

  const getStudentWithAuthorizedPersons = (studentId: string): StudentWithAuthorizedPersons | null => {
    const student = students.find(s => s.id === studentId);
    if (!student) return null;

    const course = courses.find(c => c.id === student.course_id);
    const studentAuthorizedPersons = authorizedPersons.filter(p => p.student_id === studentId);

    return {
      ...student,
      course: course!,
      authorizedPersons: studentAuthorizedPersons
    };
  };

  const getAuthorizedPersonsByStudent = (studentId: string): AuthorizedPerson[] => {
    return authorizedPersons.filter(person => person.student_id === studentId);
  };

  const searchStudents = (query: string): StudentWithCourse[] => {
    const lowercaseQuery = query.toLowerCase();
    return studentsWithCourses.filter(student =>
      student.full_name.toLowerCase().includes(lowercaseQuery) ||
      student.course.name.toLowerCase().includes(lowercaseQuery)
    );
  };

  // Initialize data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    // Data
    courses,
    students,
    authorizedPersons,
    pickupLogs,
    schedules,
    studentsWithCourses,
    loading,
    error,

    // Course operations
    addCourse,
    updateCourse,
    deleteCourse,

    // Student operations
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentWithAuthorizedPersons,

    // Authorized Person operations
    addAuthorizedPerson,
    updateAuthorizedPerson,
    deleteAuthorizedPerson,
    getAuthorizedPersonsByStudent,

    // Pickup Log operations
    registerPickup,

    // Schedule operations
    addSchedule,
    updateSchedule,
    deleteSchedule,
    getSchedulesByCourse,
    getSchedulesByDay,

    // Utility functions
    resetDailyStatus,
    searchStudents,
    refetch: fetchAllData
  };
};
