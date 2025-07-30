'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const DatabaseSetup: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Configuración de Base de Datos</h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            Configure la conexión a la base de datos y ejecute las migraciones necesarias.
          </p>
          <div className="flex space-x-4">
            <Button variant="primary">
              Configurar Supabase
            </Button>
            <Button variant="secondary">
              Ejecutar Migraciones
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
