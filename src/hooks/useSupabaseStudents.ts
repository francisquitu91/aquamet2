import { useState } from 'react';
import { supabase, logSupabaseOperation } from '@/lib/supabase';
import { Student } from '@/types';

interface UseSupabaseStudentsOptions {
  enableSync?: boolean; // Flag para activar/desactivar la sincronización
}

export const useSupabaseStudents = (options: UseSupabaseStudentsOptions = {}) => {
  const { enableSync = true } = options;
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error' | 'success'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Función para sincronizar estudiantes desde localStorage a Supabase
  const syncStudentsToSupabase = async (students: Student[]) => {
    if (!enableSync) return;

    setSyncStatus('syncing');
    try {
      logSupabaseOperation('SYNC_STUDENTS_TO_SUPABASE', { count: students.length });

      // Primero verificamos si la tabla existe y tiene datos
      const { data: existingStudents, error: fetchError } = await supabase
        .from('students')
        .select('id, updated_at')
        .limit(1);

      if (fetchError) {
        logSupabaseOperation('SYNC_ERROR_FETCH', null, fetchError);
        throw fetchError;
      }

      // Si no hay estudiantes en Supabase, los insertamos todos
      if (!existingStudents || existingStudents.length === 0) {
        logSupabaseOperation('INSERTING_ALL_STUDENTS', { count: students.length });
        
        const studentsForSupabase = students.map(student => ({
          id: student.id,
          full_name: student.full_name,
          course_id: student.course_id,
          status: student.status,
          rut_passport: student.rut_passport,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        const { data, error } = await supabase
          .from('students')
          .insert(studentsForSupabase)
          .select();

        if (error) {
          logSupabaseOperation('SYNC_ERROR_INSERT', null, error);
          throw error;
        }

        logSupabaseOperation('SYNC_SUCCESS_INSERT', { insertedCount: data?.length });
      }

      setSyncStatus('success');
      setLastSyncTime(new Date());
      
    } catch (error) {
      setSyncStatus('error');
      logSupabaseOperation('SYNC_ERROR', null, error);
      console.error('Error syncing students to Supabase:', error);
    }
  };

  // Función para obtener estudiantes desde Supabase
  const fetchStudentsFromSupabase = async (): Promise<Student[] | null> => {
    if (!enableSync) return null;

    try {
      setSyncStatus('syncing');
      logSupabaseOperation('FETCH_STUDENTS_FROM_SUPABASE');

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');

      if (error) {
        logSupabaseOperation('FETCH_ERROR', null, error);
        throw error;
      }

      const students: Student[] = data.map((item: unknown) => {
        const studentItem = item as {
          id: string;
          full_name: string;
          course_id: string;
          status: 'Presente' | 'Retirado';
          rut_passport?: string;
        };
        return {
          id: studentItem.id,
          full_name: studentItem.full_name,
          course_id: studentItem.course_id,
          status: studentItem.status,
          rut_passport: studentItem.rut_passport || ''
        };
      });

      setSyncStatus('success');
      setLastSyncTime(new Date());
      logSupabaseOperation('FETCH_SUCCESS', { count: students.length });
      
      return students;
    } catch (error) {
      setSyncStatus('error');
      logSupabaseOperation('FETCH_ERROR', null, error);
      console.error('Error fetching students from Supabase:', error);
      return null;
    }
  };

  // Función para crear/actualizar un estudiante en Supabase
  const upsertStudentToSupabase = async (student: Student) => {
    if (!enableSync) return;

    try {
      logSupabaseOperation('UPSERT_STUDENT', { studentId: student.id });

      const studentForSupabase = {
        id: student.id,
        full_name: student.full_name,
        course_id: student.course_id,
        status: student.status,
        rut_passport: student.rut_passport,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('students')
        .upsert(studentForSupabase)
        .select();

      if (error) {
        logSupabaseOperation('UPSERT_ERROR', null, error);
        throw error;
      }

      logSupabaseOperation('UPSERT_SUCCESS', { studentId: student.id });
    } catch (error) {
      logSupabaseOperation('UPSERT_ERROR', null, error);
      console.error('Error upserting student to Supabase:', error);
    }
  };

  // Función para eliminar un estudiante de Supabase
  const deleteStudentFromSupabase = async (studentId: string) => {
    if (!enableSync) return;

    try {
      logSupabaseOperation('DELETE_STUDENT', { studentId });

      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);

      if (error) {
        logSupabaseOperation('DELETE_ERROR', null, error);
        throw error;
      }

      logSupabaseOperation('DELETE_SUCCESS', { studentId });
    } catch (error) {
      logSupabaseOperation('DELETE_ERROR', null, error);
      console.error('Error deleting student from Supabase:', error);
    }
  };

  return {
    syncStatus,
    lastSyncTime,
    syncStudentsToSupabase,
    fetchStudentsFromSupabase,
    upsertStudentToSupabase,
    deleteStudentFromSupabase
  };
};
