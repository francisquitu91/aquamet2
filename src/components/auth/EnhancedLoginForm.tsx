'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Logo } from '../ui/Logo';
import {
  UserGroupIcon,
  UserIcon,
  AcademicCapIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

interface EnhancedLoginFormProps {
  onStaffLogin: (email: string, password: string) => Promise<void>;
  onParentLogin: (rut: string, password: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export const EnhancedLoginForm: React.FC<EnhancedLoginFormProps> = ({
  onStaffLogin,
  onParentLogin,
  isLoading = false,
  error
}) => {
  const [loginType, setLoginType] = useState<'staff' | 'parent'>('staff');
  const [email, setEmail] = useState('');
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginType === 'staff') {
      await onStaffLogin(email, password);
    } else {
      await onParentLogin(rut, password);
    }
  };

  const formatRUT = (value: string) => {
    // Remover caracteres no numéricos excepto K
    const clean = value.replace(/[^0-9kK]/g, '');
    
    // Formatear como XX.XXX.XXX-Y
    if (clean.length <= 1) return clean;
    if (clean.length <= 4) return clean;
    if (clean.length <= 7) {
      return `${clean.slice(0, -3)}.${clean.slice(-3)}`;
    }
    if (clean.length <= 8) {
      return `${clean.slice(0, -4)}.${clean.slice(-4, -1)}-${clean.slice(-1)}`;
    }
    
    // Para RUTs más largos
    const rut = clean.slice(0, -1);
    const dv = clean.slice(-1);
    if (rut.length <= 3) return `${rut}-${dv}`;
    if (rut.length <= 6) return `${rut.slice(0, -3)}.${rut.slice(-3)}-${dv}`;
    return `${rut.slice(0, -6)}.${rut.slice(-6, -3)}.${rut.slice(-3)}-${dv}`;
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRUT(e.target.value);
    setRut(formatted);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Logo size="xl" className="justify-center" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sistema de Retiro
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Gestión de retiro de estudiantes
          </p>
        </div>

        {/* Login Type Selector */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button
            type="button"
            onClick={() => setLoginType('staff')}
            className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
              loginType === 'staff'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserGroupIcon className="h-4 w-4 mr-2" />
            Personal
          </button>
          <button
            type="button"
            onClick={() => setLoginType('parent')}
            className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
              loginType === 'parent'
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <HeartIcon className="h-4 w-4 mr-2" />
            Apoderado
          </button>
        </div>

        <Card className="mt-8">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            {loginType === 'staff' ? (
              <div className="flex items-center text-blue-700">
                <AcademicCapIcon className="h-5 w-5 mr-2" />
                <div>
                  <p className="text-sm font-medium">Acceso para Personal</p>
                  <p className="text-xs text-gray-600">Administradores, profesores e inspectores</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center text-green-700">
                <UserIcon className="h-5 w-5 mr-2" />
                <div>
                  <p className="text-sm font-medium">Acceso para Apoderados</p>
                  <p className="text-xs text-gray-600">Consulte el estado de retiro de su hijo/a</p>
                </div>
              </div>
            )}
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            {loginType === 'staff' ? (
              <>
                <Input
                  label="Correo Electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="usuario@colegio.cl"
                  autoComplete="email"
                />

                <Input
                  label="Contraseña"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </>
            ) : (
              <>
                <Input
                  label="RUT del Estudiante"
                  type="text"
                  value={rut}
                  onChange={handleRutChange}
                  required
                  placeholder="12.345.678-9"
                  maxLength={12}
                />

                <div>
                  <Input
                    label="Contraseña"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••"
                    maxLength={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Los últimos 4 dígitos antes del dígito verificador del RUT
                  </p>
                </div>
              </>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              disabled={
                (loginType === 'staff' && (!email || !password)) ||
                (loginType === 'parent' && (!rut || !password)) ||
                isLoading
              }
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </Card>

        <div className="text-center text-sm text-gray-600">
          <p>¿Problemas para acceder?</p>
          <p>Contacta al administrador del sistema</p>
        </div>

        {/* Instructions for parents */}
        {loginType === 'parent' && (
          <Card className="bg-green-50 border border-green-200">
            <div className="p-4">
              <h4 className="text-sm font-medium text-green-800 mb-2">
                Instrucciones para Apoderados
              </h4>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• Usuario: RUT completo del estudiante (ej: 12.345.678-9)</li>
                <li>• Contraseña: Los últimos 4 dígitos antes del guión</li>
                <li>• Ejemplo: Si el RUT es 12.345.678-9, la contraseña es: 5678</li>
              </ul>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EnhancedLoginForm;
