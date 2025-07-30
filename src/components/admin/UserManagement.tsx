'use client';

import React, { useState } from 'react';
import { useUsersData, CreateUserData, UpdateUserData } from '@/hooks/useUsersData';
import { Button, Input, Modal, Card } from '../ui';
import { User } from '@/types';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export const UserManagement: React.FC = () => {
  const { 
    users, 
    loading, 
    error, 
    createUser, 
    updateUser, 
    toggleUserStatus, 
    deleteUser,
    getActiveTeachers,
    getActiveInspectors,
    getActiveStaff
  } = useUsersData();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [userForm, setUserForm] = useState<CreateUserData>({
    email: '',
    password: '',
    name: '',
    role: 'teacher',
    subject: '',
    is_active: true
  });

  // Filtrar usuarios según búsqueda
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.subject && user.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddUser = () => {
    setEditingUser(null);
    setUserForm({
      email: '',
      password: '',
      name: '',
      role: 'teacher',
      subject: '',
      is_active: true
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      email: user.email,
      password: '', // No mostrar contraseña actual
      name: user.name,
      role: user.role,
      subject: user.subject || '',
      is_active: user.is_active
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        // Actualizar usuario existente
        const updateData: UpdateUserData = {
          email: userForm.email,
          name: userForm.name,
          role: userForm.role,
          subject: userForm.subject || undefined,
          is_active: userForm.is_active
        };
        
        // Solo incluir contraseña si se proporcionó una nueva
        if (userForm.password.trim()) {
          updateData.password = userForm.password;
        }
        
        await updateUser(editingUser.id, updateData);
      } else {
        // Crear nuevo usuario
        if (!userForm.password.trim()) {
          throw new Error('La contraseña es requerida para usuarios nuevos');
        }
        await createUser(userForm);
      }
      
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(errorMessage);
    }
  };

  const handleToggleStatus = async (user: User) => {
    if (confirm(`¿Está seguro de ${user.is_active ? 'desactivar' : 'activar'} a ${user.name}?`)) {
      try {
        await toggleUserStatus(user.id);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        alert(errorMessage);
      }
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (confirm(`¿Está seguro de eliminar a ${user.name}? Esta acción no se puede deshacer.`)) {
      try {
        await deleteUser(user.id);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        alert(errorMessage);
      }
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
          <p className="text-gray-600">Administra cuentas de profesores, inspectores y administradores</p>
        </div>
        <Button onClick={handleAddUser} className="flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Crear Usuario
        </Button>
      </div>

      {/* Search bar */}
      <Card>
        <div className="p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar por nombre, email o asignatura/área..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Users table */}
      <Card>
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative">
          {/* Indicador de scroll para móviles */}
          <div className="lg:hidden absolute top-0 right-0 h-full w-6 bg-gradient-to-l from-white via-white to-transparent pointer-events-none z-10 opacity-50"></div>
          <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                  Asignatura/Área
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : user.role === 'inspector'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role === 'admin' ? 'Administrador' : user.role === 'inspector' ? 'Inspector' : 'Profesor'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.subject ? (
                        <div className="flex items-center">
                          <AcademicCapIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {user.subject}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleToggleStatus(user)}
                          className={user.is_active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                        >
                          {user.is_active ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </Button>
                        {user.role !== 'admin' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create/Edit User Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre Completo"
            type="text"
            value={userForm.name}
            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
            required
            placeholder="Ej: Profesor Raul García"
          />

          <Input
            label="Correo Electrónico"
            type="email"
            value={userForm.email}
            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            required
            placeholder="Ej: raul@sagradafamilia.cl"
          />

          <div className="relative">
            <Input
              label={editingUser ? "Nueva Contraseña (dejar vacío para mantener actual)" : "Contraseña"}
              type={showPassword ? "text" : "password"}
              value={userForm.password}
              onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
              required={!editingUser}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol
            </label>
            <select
              value={userForm.role}
              onChange={(e) => setUserForm({ ...userForm, role: e.target.value as 'admin' | 'teacher' | 'inspector' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="teacher">Profesor</option>
              <option value="inspector">Inspector</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <Input
            label="Asignatura/Área (opcional)"
            type="text"
            value={userForm.subject}
            onChange={(e) => setUserForm({ ...userForm, subject: e.target.value })}
            placeholder="Ej: Matemática, Historia, Inspectoría General"
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={userForm.is_active}
              onChange={(e) => setUserForm({ ...userForm, is_active: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
              Usuario activo
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {editingUser ? 'Actualizar' : 'Crear Usuario'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
