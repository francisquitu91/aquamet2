import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button, Input, Modal, Card } from '../ui';
import { AuthorizedPerson, Student } from '@/types';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  UserIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export const StudentManagement: React.FC = () => {
  const { 
    studentsWithCourses, 
    courses, 
    addStudent, 
    updateStudent, 
    deleteStudent,
    getAuthorizedPersonsByStudent,
    addAuthorizedPerson,
    updateAuthorizedPerson,
    deleteAuthorizedPerson,
    resetDailyStatus
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isAuthorizedPersonModalOpen, setIsAuthorizedPersonModalOpen] = useState(false);
  const [editingAuthorizedPerson, setEditingAuthorizedPerson] = useState<AuthorizedPerson | null>(null);
  const [isResettingStatus, setIsResettingStatus] = useState(false);

  // Form states
  const [studentForm, setStudentForm] = useState({
    full_name: '',
    course_id: '',
    rut_passport: ''
  });

  const [authorizedPersonForm, setAuthorizedPersonForm] = useState({
    full_name: '',
    relationship: ''
  });

  // Filter students based on search
  const filteredStudents = studentsWithCourses.filter(student =>
    student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle student operations
  const handleAddStudent = () => {
    setEditingStudent(null);
    setStudentForm({ full_name: '', course_id: '', rut_passport: '' });
    setIsModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setStudentForm({
      full_name: student.full_name,
      course_id: student.course_id,
      rut_passport: student.rut_passport || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
      deleteStudent(studentId);
    }
  };

  const handleSaveStudent = async () => {
    if (!studentForm.full_name || !studentForm.course_id) return;

    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, studentForm);
      } else {
        await addStudent(studentForm);
      }

      setIsModalOpen(false);
      setStudentForm({ full_name: '', course_id: '', rut_passport: '' });
      setEditingStudent(null);
    } catch (error) {
      console.error('Error saving student:', error);
      // Aquí podrías mostrar un toast de error
    }
  };

  // Handle daily status reset
  const handleResetDailyStatus = async () => {
    const confirm = window.confirm(
      '¿Estás seguro de que deseas resetear el estado de todos los estudiantes a "Presente"?\n\n' +
      'Esta acción marcará a todos los estudiantes como presentes para comenzar el día.'
    );
    
    if (!confirm) return;

    setIsResettingStatus(true);
    try {
      await resetDailyStatus();
      // Podrías agregar aquí un toast de éxito
      alert('Estado de estudiantes restablecido correctamente. Todos los estudiantes están ahora marcados como "Presente".');
    } catch (error) {
      console.error('Error resetting daily status:', error);
      alert('Error al restablecer el estado de los estudiantes. Por favor, intenta nuevamente.');
    } finally {
      setIsResettingStatus(false);
    }
  };

  // Handle authorized person operations
  const handleViewAuthorizedPersons = (studentId: string) => {
    setSelectedStudentId(studentId);
  };

  const handleAddAuthorizedPerson = () => {
    setEditingAuthorizedPerson(null);
    setAuthorizedPersonForm({ full_name: '', relationship: '' });
    setIsAuthorizedPersonModalOpen(true);
  };

  const handleEditAuthorizedPerson = (person: AuthorizedPerson) => {
    setEditingAuthorizedPerson(person);
    setAuthorizedPersonForm({
      full_name: person.full_name,
      relationship: person.relationship
    });
    setIsAuthorizedPersonModalOpen(true);
  };

  const handleDeleteAuthorizedPerson = (personId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta persona autorizada?')) {
      deleteAuthorizedPerson(personId);
    }
  };

  const handleSaveAuthorizedPerson = () => {
    if (!authorizedPersonForm.full_name || !authorizedPersonForm.relationship || !selectedStudentId) return;

    if (editingAuthorizedPerson) {
      updateAuthorizedPerson(editingAuthorizedPerson.id, authorizedPersonForm);
    } else {
      addAuthorizedPerson({
        ...authorizedPersonForm,
        student_id: selectedStudentId
      });
    }

    setIsAuthorizedPersonModalOpen(false);
    setAuthorizedPersonForm({ full_name: '', relationship: '' });
    setEditingAuthorizedPerson(null);
  };

  const selectedStudent = studentsWithCourses.find(s => s.id === selectedStudentId);
  const authorizedPersons = selectedStudentId ? getAuthorizedPersonsByStudent(selectedStudentId) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gestión de Estudiantes</h2>
          <p className="text-gray-600 text-sm sm:text-base">Administra estudiantes y personas autorizadas</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={handleResetDailyStatus} 
            variant="secondary"
            disabled={isResettingStatus}
            className="flex items-center justify-center w-full sm:w-auto"
          >
            <ArrowPathIcon className={`h-5 w-5 mr-2 ${isResettingStatus ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {isResettingStatus ? 'Reseteando...' : 'Resetear Estado'}
            </span>
            <span className="sm:hidden">
              {isResettingStatus ? 'Reseteando...' : 'Reset'}
            </span>
          </Button>
          <Button onClick={handleAddStudent} className="flex items-center justify-center w-full sm:w-auto">
            <PlusIcon className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Agregar Estudiante</span>
            <span className="sm:hidden">Agregar</span>
          </Button>
        </div>
      </div>

      {/* Search bar */}
      <Card>
        <div className="p-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar estudiante por nombre o curso..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Students table */}
      <Card>
        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RUT/Pasaporte
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Personas Autorizadas
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => {
                const authorizedCount = getAuthorizedPersonsByStudent(student.id).length;
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserIcon className="h-8 w-8 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {student.full_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">
                        {student.rut_passport || 'Sin asignar'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {student.course.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.status === 'Presente' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewAuthorizedPersons(student.id)}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <UsersIcon className="h-4 w-4 mr-1" />
                        {authorizedCount} persona{authorizedCount !== 1 ? 's' : ''}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEditStudent(student)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No se encontraron estudiantes' : 'No hay estudiantes registrados'}
            </div>
          )}
        </div>

        {/* Mobile cards */}
        <div className="lg:hidden space-y-4 p-4">
          {filteredStudents.map((student) => {
            const authorizedCount = getAuthorizedPersonsByStudent(student.id).length;
            return (
              <div key={student.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <UserIcon className="h-8 w-8 text-gray-400 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{student.full_name}</h3>
                      <p className="text-xs text-gray-600 font-mono mt-0.5">
                        {student.rut_passport || 'Sin RUT/Pasaporte asignado'}
                      </p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                        {student.course.name}
                      </span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    student.status === 'Presente' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {student.status}
                  </span>
                </div>
                
                <div className="mb-3">
                  <button
                    onClick={() => handleViewAuthorizedPersons(student.id)}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <UsersIcon className="h-4 w-4 mr-1" />
                    {authorizedCount} persona{authorizedCount !== 1 ? 's' : ''} autorizada{authorizedCount !== 1 ? 's' : ''}
                  </button>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEditStudent(student)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteStudent(student.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No se encontraron estudiantes' : 'No hay estudiantes registrados'}
            </div>
          )}
        </div>
      </Card>

      {/* Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? 'Editar Estudiante' : 'Agregar Estudiante'}
      >
        <div className="space-y-4">
          <Input
            label="Nombre Completo"
            value={studentForm.full_name}
            onChange={(e) => setStudentForm({ ...studentForm, full_name: e.target.value })}
            placeholder="Ej: María García López"
          />
          
          <Input
            label="RUT/Pasaporte"
            value={studentForm.rut_passport}
            onChange={(e) => setStudentForm({ ...studentForm, rut_passport: e.target.value })}
            placeholder="Ej: 12.345.678-9 o Pasaporte AB123456"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Curso
            </label>
            <select
              value={studentForm.course_id}
              onChange={(e) => setStudentForm({ ...studentForm, course_id: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar curso</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveStudent}
              disabled={!studentForm.full_name || !studentForm.course_id}
            >
              {editingStudent ? 'Actualizar' : 'Agregar'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Authorized Persons Modal */}
      <Modal
        isOpen={!!selectedStudentId}
        onClose={() => setSelectedStudentId(null)}
        title={`Personas Autorizadas - ${selectedStudent?.full_name}`}
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Gestiona las personas autorizadas para retirar a este estudiante
            </p>
            <Button size="sm" onClick={handleAddAuthorizedPerson}>
              <PlusIcon className="h-4 w-4 mr-1" />
              Agregar
            </Button>
          </div>

          {authorizedPersons.length > 0 ? (
            <div className="space-y-3">
              {authorizedPersons.map((person) => (
                <div key={person.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{person.full_name}</h4>
                    <p className="text-sm text-gray-600">{person.relationship}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEditAuthorizedPerson(person)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteAuthorizedPerson(person.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No hay personas autorizadas registradas
            </div>
          )}
        </div>
      </Modal>

      {/* Authorized Person Form Modal */}
      <Modal
        isOpen={isAuthorizedPersonModalOpen}
        onClose={() => setIsAuthorizedPersonModalOpen(false)}
        title={editingAuthorizedPerson ? 'Editar Persona Autorizada' : 'Agregar Persona Autorizada'}
      >
        <div className="space-y-4">
          <Input
            label="Nombre Completo"
            value={authorizedPersonForm.full_name}
            onChange={(e) => setAuthorizedPersonForm({ ...authorizedPersonForm, full_name: e.target.value })}
            placeholder="Ej: Carmen López Morales"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relación
            </label>
            <select
              value={authorizedPersonForm.relationship}
              onChange={(e) => setAuthorizedPersonForm({ ...authorizedPersonForm, relationship: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar relación</option>
              <option value="Madre">Madre</option>
              <option value="Padre">Padre</option>
              <option value="Abuela">Abuela</option>
              <option value="Abuelo">Abuelo</option>
              <option value="Tía">Tía</option>
              <option value="Tío">Tío</option>
              <option value="Hermana">Hermana</option>
              <option value="Hermano">Hermano</option>
              <option value="Transporte Escolar">Transporte Escolar</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsAuthorizedPersonModalOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveAuthorizedPerson}
              disabled={!authorizedPersonForm.full_name || !authorizedPersonForm.relationship}
            >
              {editingAuthorizedPerson ? 'Actualizar' : 'Agregar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
