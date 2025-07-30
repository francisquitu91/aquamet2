'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Modal, Button } from '../ui';
import { StudentWithAuthorizedPersons } from '@/types';
import { 
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

interface StudentPickupModalProps {
  student: StudentWithAuthorizedPersons;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentPickupModal: React.FC<StudentPickupModalProps> = ({
  student,
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const { registerPickup, getAuthorizedPersonsByStudent } = useData();
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get authorized persons for this student
  const authorizedPersons = getAuthorizedPersonsByStudent(student.id);

  const handlePersonSelect = (personId: string) => {
    setSelectedPersonId(personId);
    setShowConfirmation(true);
  };

  const handleConfirmPickup = async () => {
    if (!selectedPersonId || !user) return;

    setIsProcessing(true);
    try {
      await registerPickup(student.id, selectedPersonId, user.name);
      // Close modal after successful registration
      setTimeout(() => {
        onClose();
        setShowConfirmation(false);
        setSelectedPersonId(null);
      }, 1000);
    } catch (error) {
      console.error('Error registering pickup:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setSelectedPersonId(null);
  };

  const selectedPerson = authorizedPersons.find(p => p.id === selectedPersonId);

  if (student.status === 'Retirado') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Estudiante ya retirado">
        <div className="text-center py-6">
          <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {student.full_name}
          </h3>
          <p className="text-gray-600 mb-4">
            Este estudiante ya ha sido retirado.
          </p>
          <Button onClick={onClose} variant="secondary">
            Cerrar
          </Button>
        </div>
      </Modal>
    );
  }

  if (showConfirmation && selectedPerson) {
    return (
      <Modal isOpen={isOpen} onClose={handleCancel} title="Confirmar retiro">
        <div className="text-center py-6">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Confirmar retiro
          </h3>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-gray-800 mb-2">
              <strong>Estudiante:</strong> {student.full_name}
            </p>
            <p className="text-gray-800 mb-2">
              <strong>Curso:</strong> {student.course.name}
            </p>
            <p className="text-gray-800">
              <strong>Persona autorizada:</strong> {selectedPerson.full_name} ({selectedPerson.relationship})
            </p>
          </div>
          <p className="text-gray-600 mb-6">
            ¿Confirmas el retiro de {student.full_name} por {selectedPerson.full_name}?
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
            <Button 
              onClick={handleCancel} 
              variant="secondary"
              disabled={isProcessing}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmPickup}
              variant="success"
              isLoading={isProcessing}
              disabled={isProcessing}
              className="w-full sm:w-auto"
            >
              {isProcessing ? 'Registrando...' : 'Confirmar retiro'}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar retiro" size="lg">
      <div className="py-4">
        {/* Student info */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-center mb-2">
            <UserIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              {student.full_name}
            </h3>
          </div>
          <p className="text-gray-700">
            <strong>Curso:</strong> {student.course.name}
          </p>
        </div>

        {/* Authorized persons */}
        <div className="mb-6">
          <h4 className="text-base sm:text-md font-medium text-gray-900 mb-4">
            Selecciona la persona autorizada que retira al estudiante:
          </h4>
          
          {authorizedPersons.length > 0 ? (
            <div className="space-y-3">
              {authorizedPersons.map((person) => (
                <button
                  key={person.id}
                  onClick={() => handlePersonSelect(person.id)}
                  className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation active:bg-blue-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        {person.full_name}
                      </h5>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        {person.relationship}
                      </p>
                    </div>
                    <div className="text-blue-600 flex-shrink-0 ml-3">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                No hay personas autorizadas registradas para este estudiante.
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Contacta al administrador para agregar personas autorizadas.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <Button onClick={onClose} variant="secondary" className="w-full sm:w-auto">
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
