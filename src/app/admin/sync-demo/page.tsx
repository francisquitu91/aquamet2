import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui';
import { 
  DevicePhoneMobileIcon, 
  ComputerDesktopIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function SyncDemoPage() {
  return (
    <AdminLayout activeSection="">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🔄 Sincronización en Tiempo Real</h2>
          <p className="text-gray-600">
            El sistema ahora sincroniza datos entre todas las sesiones abiertas
          </p>
        </div>

        {/* How it works */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              ✨ Cómo Funciona la Sincronización
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Admin */}
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <ComputerDesktopIcon className="h-12 w-12 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Admin (Escritorio)</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Gestiona estudiantes</li>
                  <li>• Ve reportes</li>
                  <li>• Configura horarios</li>
                </ul>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center">
                <ArrowRightIcon className="h-6 w-6 text-gray-400" />
                <span className="text-sm text-gray-500 mx-2">Sincronización<br/>Automática</span>
                <ArrowRightIcon className="h-6 w-6 text-gray-400" />
              </div>

              {/* Teacher */}
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <DevicePhoneMobileIcon className="h-12 w-12 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Teacher (Móvil)</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Registra retiros</li>
                  <li>• Ve estudiantes</li>
                  <li>• Busca alumnos</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                🚀 Características Implementadas
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">LocalStorage Sincronizado</p>
                    <p className="text-sm text-gray-600">Datos compartidos entre pestañas del mismo navegador</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Polling Automático</p>
                    <p className="text-sm text-gray-600">Verifica cambios cada 2 segundos</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Indicador Visual</p>
                    <p className="text-sm text-gray-600">Muestra estado de sincronización en tiempo real</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">React Contexts Reactivos</p>
                    <p className="text-sm text-gray-600">Propagación instantánea de cambios</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                🧪 Cómo Probar la Sincronización
              </h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Prueba 1: Mismo Navegador</h4>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Abre admin en una pestaña</li>
                    <li>Abre teacher en otra pestaña</li>
                    <li>Registra un retiro en teacher</li>
                    <li>Ve el cambio instantáneo en admin</li>
                  </ol>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Prueba 2: Dispositivos Diferentes</h4>
                  <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
                    <li>Admin en computadora</li>
                    <li>Teacher en tablet/móvil</li>
                    <li>Los cambios se sincronizan automáticamente</li>
                    <li>Observa el indicador de sincronización</li>
                  </ol>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Next Steps */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              🔮 Próximos Pasos para Sincronización Completa
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">WebSockets</h4>
                <p className="text-sm text-yellow-800">Sincronización instantánea en tiempo real</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Base de Datos</h4>
                <p className="text-sm text-purple-800">PostgreSQL con sincronización servidor</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">Redis</h4>
                <p className="text-sm text-red-800">Cache distribuido para múltiples servidores</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-medium text-indigo-900 mb-2">PWA</h4>
                <p className="text-sm text-indigo-800">Funcionamiento offline con sincronización</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
