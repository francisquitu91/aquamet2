'use client';

import React from 'react';
import { DatabaseSetup } from '@/components/setup/DatabaseSetup';

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Configuración del Sistema
        </h1>
        <DatabaseSetup />
      </div>
    </div>
  );
}
