 'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginAsParent: (rut: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Función para extraer los últimos 4 dígitos antes del dígito verificador del RUT
  const extractPasswordFromRUT = (rut: string): string => {
    // Limpiar el RUT: remover puntos, guiones y espacios
    const cleanRut = rut.replace(/[.\-\s]/g, '');
    
    // Tomar los últimos 5 caracteres y quitar el último (dígito verificador)
    // Esto nos da los últimos 4 dígitos antes del verificador
    if (cleanRut.length >= 5) {
      return cleanRut.slice(-5, -1);
    }
    
    // Si el RUT es muy corto, devolver los últimos dígitos disponibles
    return cleanRut.slice(0, -1);
  };

  // Función para autenticar apoderado usando RUT del estudiante
  const authenticateParent = async (rut: string, password: string): Promise<User | null> => {
    try {
      // Buscar el estudiante por RUT
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('id, full_name, rut_passport')
        .eq('rut_passport', rut)
        .single();

      if (studentError || !studentData) {
        throw new Error('RUT no encontrado en el sistema');
      }

      // Verificar que la contraseña coincida con los últimos 4 dígitos del RUT
      const expectedPassword = extractPasswordFromRUT(rut);
      
      if (password !== expectedPassword) {
        throw new Error('Contraseña incorrecta');
      }

      // Crear un usuario virtual para el apoderado
      const parentUser: User = {
        id: `parent_${studentData.id}`,
        email: rut, // Usamos el RUT como email para identificación
        name: `Apoderado de ${studentData.full_name}`,
        role: 'Parent',
        subject: undefined,
        is_active: true
      };

      return parentUser;
    } catch (error: unknown) {
      console.error('Parent authentication error:', error);
      throw new Error('Credenciales incorrectas');
    }
  };
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

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Authenticate using Supabase
      const authenticatedUser = await authenticateUser(email, password);
      
      if (!authenticatedUser) {
        throw new Error('Credenciales incorrectas');
      }

      // Don't store password hash in localStorage for security
      const userForStorage = {
        id: authenticatedUser.id,
        email: authenticatedUser.email,
        name: authenticatedUser.name,
        role: authenticatedUser.role,
        subject: authenticatedUser.subject,
        is_active: authenticatedUser.is_active
      };

      setUser(userForStorage);
      localStorage.setItem('user', JSON.stringify(userForStorage));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de autenticación';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsParent = async (rut: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Authenticate as parent using RUT
      const authenticatedParent = await authenticateParent(rut, password);
      
      if (!authenticatedParent) {
        throw new Error('Credenciales incorrectas');
      }

      setUser(authenticatedParent);
      localStorage.setItem('user', JSON.stringify(authenticatedParent));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de autenticación';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setError(null);
  };

  const value: AuthContextType = {
    user,
    login,
    loginAsParent,
    logout,
    isLoading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
