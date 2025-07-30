'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';

// Interface para crear un nuevo usuario (sin campos automáticos)
export interface CreateUserData {
  email: string;
  password: string; // Contraseña en texto plano (se hashea en el servidor)
  name: string;
  role: 'admin' | 'teacher' | 'inspector' | 'Parent';
  subject?: string;
  is_active?: boolean;
}

// Interface para actualizar un usuario existente
export interface UpdateUserData {
  email?: string;
  password?: string; // Nueva contraseña (opcional)
  name?: string;
  role?: 'admin' | 'teacher' | 'inspector' | 'Parent';
  subject?: string;
  is_active?: boolean;
}

export const useUsersData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener todos los usuarios
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name, role, subject, is_active, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data || []);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para autenticar usuario
  const authenticateUser = async (email: string, password: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name, role, subject, is_active, created_at, updated_at')
        .eq('email', email)
        .eq('password_hash', password) // En producción usar bcrypt
        .eq('is_active', true)
        .single();

      if (error || !data) {
        throw new Error('Credenciales incorrectas');
      }

      return data;
    } catch (error: unknown) {
      console.error('Authentication error:', error);
      throw new Error('Credenciales incorrectas');
    }
  };

  // Función para crear un nuevo usuario
  const createUser = async (userData: CreateUserData): Promise<User> => {
    try {
      // Verificar que el email no exista
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        throw new Error('Ya existe un usuario con ese correo electrónico');
      }

      // Crear el usuario (en producción, hashear la contraseña)
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          password_hash: userData.password, // En producción usar bcrypt
          name: userData.name,
          role: userData.role,
          subject: userData.subject,
          is_active: userData.is_active ?? true
        })
        .select('id, email, name, role, subject, is_active, created_at, updated_at')
        .single();

      if (error) throw error;

      setUsers(prev => [data, ...prev]);
      return data;
    } catch (error: unknown) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  // Función para actualizar un usuario
  const updateUser = async (id: string, userData: UpdateUserData): Promise<User> => {
    try {
      const updateData: Record<string, unknown> = { ...userData };
      
      // Si se proporciona nueva contraseña, actualizar el hash
      if (userData.password) {
        updateData.password_hash = userData.password; // En producción usar bcrypt
        delete updateData.password;
      }

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select('id, email, name, role, subject, is_active, created_at, updated_at')
        .single();

      if (error) throw error;

      setUsers(prev => prev.map(user => user.id === id ? data : user));
      return data;
    } catch (error: unknown) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  // Función para desactivar/activar un usuario (no eliminar por integridad de datos)
  const toggleUserStatus = async (id: string): Promise<void> => {
    try {
      const user = users.find(u => u.id === id);
      if (!user) throw new Error('Usuario no encontrado');

      await updateUser(id, { is_active: !user.is_active });
    } catch (error: unknown) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  };

  // Función para eliminar un usuario (solo si no tiene registros asociados)
  const deleteUser = async (id: string): Promise<void> => {
    try {
      // Verificar si el usuario tiene registros de retiros asociados
      const { data: pickupLogs } = await supabase
        .from('pickup_logs')
        .select('id')
        .eq('recorded_by_user', users.find(u => u.id === id)?.name)
        .limit(1);

      if (pickupLogs && pickupLogs.length > 0) {
        throw new Error('No se puede eliminar el usuario porque tiene registros de retiros asociados. Use desactivar en su lugar.');
      }

      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (error: unknown) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  // Obtener usuarios activos para dropdowns
  const getActiveTeachers = (): User[] => {
    return users.filter(user => user.role === 'teacher' && user.is_active);
  };

  // Obtener inspectores activos
  const getActiveInspectors = (): User[] => {
    return users.filter(user => user.role === 'inspector' && user.is_active);
  };

  // Obtener todos los usuarios activos que pueden registrar retiros (teachers + inspectors)
  const getActiveStaff = (): User[] => {
    return users.filter(user => (user.role === 'teacher' || user.role === 'inspector') && user.is_active);
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    authenticateUser,
    createUser,
    updateUser,
    toggleUserStatus,
    deleteUser,
    getActiveTeachers,
    getActiveInspectors,
    getActiveStaff
  };
};
