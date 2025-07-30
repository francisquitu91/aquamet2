'use client';

import { useEffect, useState } from 'react';
import ParentLayout from '@/components/parent/ParentLayout';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Student, AuthorizedPerson, StudentWithCourse } from '@/types';
import {
  UsersIcon,
  UserIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PhoneIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';

const ParentAuthorized = () => {
  const { user } = useAuth();
  const { studentsWithCourses, authorizedPersons } = useSupabaseData();
  const [myStudent, setMyStudent] = useState<StudentWithCourse | null>(null);
  const [myAuthorizedPersons, setMyAuthorizedPersons] = useState<AuthorizedPerson[]>([]);

  useEffect(() => {
    if (user?.email && studentsWithCourses.length > 0) {
      // Buscar el estudiante que corresponde al RUT del apoderado
      const studentRut = user.email;
      const foundStudent = studentsWithCourses.find(student => 
        student.rut_passport === studentRut
      );
      
      if (foundStudent) {
        setMyStudent(foundStudent);
        
        // Buscar las personas autorizadas para este estudiante
        const studentAuthorized = authorizedPersons.filter(person => 
          person.student_id === foundStudent.id
        );
        setMyAuthorizedPersons(studentAuthorized);
      }
    }
  }, [user, studentsWithCourses, authorizedPersons]);

  const getRelationshipColor = (relationship: string) => {
    const normalizedRel = relationship.toLowerCase();
    if (normalizedRel.includes('madre') || normalizedRel.includes('mamá')) {
      return 'bg-pink-100 text-pink-800';
    }
    if (normalizedRel.includes('padre') || normalizedRel.includes('papá')) {
      return 'bg-blue-100 text-blue-800';
    }
    if (normalizedRel.includes('abuelo') || normalizedRel.includes('abuela')) {
      return 'bg-purple-100 text-purple-800';
    }
    if (normalizedRel.includes('tío') || normalizedRel.includes('tía')) {
      return 'bg-yellow-100 text-yellow-800';
    }
    if (normalizedRel.includes('transporte') || normalizedRel.includes('chofer')) {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  if (!myStudent) {
    return (
      <ParentLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No se encontró información del estudiante
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No se pudo encontrar un estudiante asociado a su RUT.
            </p>
          </div>
        </div>
      </ParentLayout>
    );
  }

  return (
    <ParentLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Personas Autorizadas
          </h1>
          <p className="text-gray-600">
            Personas que pueden retirar a {myStudent.full_name}
          </p>
        </div>

        {/* Student Info Card */}
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <UserIcon className="h-10 w-10 text-gray-400 bg-gray-100 rounded-full p-2" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">
                  {myStudent.full_name}
                </h2>
                <p className="text-sm text-gray-600 font-mono">
                  RUT: {myStudent.rut_passport}
                </p>
                <p className="text-sm text-gray-600">
                  Curso: {myStudent.course?.name || 'No asignado'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Authorized Persons List */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <UsersIcon className="h-5 w-5 mr-2" />
                Personas Autorizadas para Retiro
              </h3>
              <span className="text-sm text-gray-500">
                {myAuthorizedPersons.length} persona{myAuthorizedPersons.length !== 1 ? 's' : ''} autorizada{myAuthorizedPersons.length !== 1 ? 's' : ''}
              </span>
            </div>

            {myAuthorizedPersons.length > 0 ? (
              <div className="space-y-4">
                {myAuthorizedPersons.map((person, index) => (
                  <div
                    key={person.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-lg font-medium text-gray-900">
                              {person.full_name}
                            </h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRelationshipColor(person.relationship)}`}>
                              {person.relationship}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <IdentificationIcon className="h-4 w-4 mr-1" />
                            <span>Persona autorizada #{index + 1}</span>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <CheckCircleIcon className="h-4 w-4 text-green-600 mr-1" />
                              <span>Autorizada para retiro</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h4 className="mt-2 text-sm font-medium text-gray-900">
                  No hay personas autorizadas registradas
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  No se han registrado personas autorizadas para retirar a este estudiante.
                </p>
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Importante:</strong> Para agregar o modificar personas autorizadas, 
                    debe contactar directamente a la administración del colegio.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Information Card */}
        <Card className="bg-blue-50 border border-blue-200">
          <div className="p-6">
            <h4 className="text-lg font-medium text-blue-900 mb-3">
              Información Importante
            </h4>
            <div className="space-y-2 text-sm text-blue-800">
              <p className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Solo las personas autorizadas registradas pueden retirar al estudiante.
              </p>
              <p className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                La persona debe presentar su cédula de identidad al momento del retiro.
              </p>
              <p className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Para agregar, modificar o eliminar personas autorizadas, contacte a la administración.
              </p>
              <p className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Los cambios en la lista de autorizados pueden demorar hasta 24 horas en aplicarse.
              </p>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="bg-gray-50 border border-gray-200">
          <div className="p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <PhoneIcon className="h-5 w-5 mr-2" />
              Contacto Administración
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-900">Secretaría</p>
                <p>Teléfono: (02) 2XXX-XXXX</p>
                <p>Email: secretaria@colegio.cl</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Horario de Atención</p>
                <p>Lunes a Viernes: 8:00 - 17:00</p>
                <p>Sábados: 9:00 - 13:00</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ParentLayout>
  );
};

export default ParentAuthorized;
