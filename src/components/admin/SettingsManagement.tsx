import React, { useState } from 'react';
import { Card, Button, Input } from '../ui';
import { 
  ClockIcon,
  Cog6ToothIcon,
  BuildingOfficeIcon,
  BellIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export const SettingsManagement: React.FC = () => {
  const [settings, setSettings] = useState({
    institutionName: 'Colegio Sagrada Familia',
    address: 'Dirección del Colegio',
    phone: '+56 9 1234 5678',
    email: 'contacto@colegiosagradafamilia.cl',
    pickupSchedules: [
      { day: 'Lunes a Jueves', startTime: '16:00', endTime: '16:30' },
      { day: 'Viernes', startTime: '13:15', endTime: '13:45' }
    ],
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      autoResetTime: '04:00'
    },
    security: {
      sessionTimeout: 60,
      requireTwoFactor: false,
      passwordMinLength: 8
    }
  });

  const [isEditing, setIsEditing] = useState({
    institution: false,
    pickupTimes: false,
    notifications: false,
    security: false
  });

  const handleSaveInstitution = () => {
    setIsEditing({ ...isEditing, institution: false });
    // Here you would save to backend
  };

  const handleSavePickupTimes = () => {
    setIsEditing({ ...isEditing, pickupTimes: false });
    // Here you would save to backend
  };

  const handleSaveNotifications = () => {
    setIsEditing({ ...isEditing, notifications: false });
    // Here you would save to backend
  };

  const handleSaveSecurity = () => {
    setIsEditing({ ...isEditing, security: false });
    // Here you would save to backend
  };

  const addPickupSchedule = () => {
    setSettings({
      ...settings,
      pickupSchedules: [...settings.pickupSchedules, { day: '', startTime: '', endTime: '' }]
    });
  };

  const removePickupSchedule = (index: number) => {
    setSettings({
      ...settings,
      pickupSchedules: settings.pickupSchedules.filter((_, i) => i !== index)
    });
  };

  const updatePickupSchedule = (index: number, field: string, value: string) => {
    const updated = settings.pickupSchedules.map((schedule, i) => 
      i === index ? { ...schedule, [field]: value } : schedule
    );
    setSettings({ ...settings, pickupSchedules: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h2>
        <p className="text-gray-600">Administra la configuración general del sistema</p>
      </div>

      {/* Institution Information */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">Información Institucional</h3>
            </div>
            {!isEditing.institution ? (
              <Button
                variant="secondary"
                onClick={() => setIsEditing({ ...isEditing, institution: true })}
              >
                Editar
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button variant="secondary" onClick={() => setIsEditing({ ...isEditing, institution: false })}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveInstitution}>
                  Guardar
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre de la Institución"
              value={settings.institutionName}
              onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })}
              disabled={!isEditing.institution}
            />
            <Input
              label="Teléfono"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              disabled={!isEditing.institution}
            />
            <Input
              label="Dirección"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              disabled={!isEditing.institution}
            />
            <Input
              label="Email"
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              disabled={!isEditing.institution}
            />
          </div>
        </div>
      </Card>

      {/* Pickup Schedules */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <ClockIcon className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-medium text-gray-900">Horarios de Retiro</h3>
            </div>
            {!isEditing.pickupTimes ? (
              <Button
                variant="secondary"
                onClick={() => setIsEditing({ ...isEditing, pickupTimes: true })}
              >
                Editar
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button variant="secondary" onClick={() => setIsEditing({ ...isEditing, pickupTimes: false })}>
                  Cancelar
                </Button>
                <Button onClick={handleSavePickupTimes}>
                  Guardar
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {settings.pickupSchedules.map((schedule, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <Input
                  label="Días"
                  value={schedule.day}
                  onChange={(e) => updatePickupSchedule(index, 'day', e.target.value)}
                  disabled={!isEditing.pickupTimes}
                  placeholder="Ej: Lunes a Viernes"
                />
                <Input
                  label="Hora Inicio"
                  type="time"
                  value={schedule.startTime}
                  onChange={(e) => updatePickupSchedule(index, 'startTime', e.target.value)}
                  disabled={!isEditing.pickupTimes}
                />
                <Input
                  label="Hora Fin"
                  type="time"
                  value={schedule.endTime}
                  onChange={(e) => updatePickupSchedule(index, 'endTime', e.target.value)}
                  disabled={!isEditing.pickupTimes}
                />
                {isEditing.pickupTimes && (
                  <Button
                    variant="danger"
                    onClick={() => removePickupSchedule(index)}
                    disabled={settings.pickupSchedules.length <= 1}
                  >
                    Eliminar
                  </Button>
                )}
              </div>
            ))}
            
            {isEditing.pickupTimes && (
              <Button variant="secondary" onClick={addPickupSchedule}>
                Agregar Horario
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <BellIcon className="h-6 w-6 text-yellow-600" />
              <h3 className="text-lg font-medium text-gray-900">Notificaciones y Automatización</h3>
            </div>
            {!isEditing.notifications ? (
              <Button
                variant="secondary"
                onClick={() => setIsEditing({ ...isEditing, notifications: true })}
              >
                Editar
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button variant="secondary" onClick={() => setIsEditing({ ...isEditing, notifications: false })}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveNotifications}>
                  Guardar
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Notificaciones por Email</label>
                <p className="text-xs text-gray-500">Enviar notificaciones de retiros por email</p>
              </div>
              <button
                type="button"
                disabled={!isEditing.notifications}
                onClick={() => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, emailNotifications: !settings.notifications.emailNotifications }
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.notifications.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                } ${!isEditing.notifications ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Notificaciones por SMS</label>
                <p className="text-xs text-gray-500">Enviar notificaciones de retiros por SMS</p>
              </div>
              <button
                type="button"
                disabled={!isEditing.notifications}
                onClick={() => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, smsNotifications: !settings.notifications.smsNotifications }
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.notifications.smsNotifications ? 'bg-blue-600' : 'bg-gray-200'
                } ${!isEditing.notifications ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <Input
              label="Hora de Reset Automático"
              type="time"
              value={settings.notifications.autoResetTime}
              onChange={(e) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, autoResetTime: e.target.value }
              })}
              disabled={!isEditing.notifications}
              hint="Hora a la que se resetea automáticamente el estado de los estudiantes"
            />
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <UserGroupIcon className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-medium text-gray-900">Seguridad</h3>
            </div>
            {!isEditing.security ? (
              <Button
                variant="secondary"
                onClick={() => setIsEditing({ ...isEditing, security: true })}
              >
                Editar
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button variant="secondary" onClick={() => setIsEditing({ ...isEditing, security: false })}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveSecurity}>
                  Guardar
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Input
              label="Tiempo de Sesión (minutos)"
              type="number"
              value={settings.security.sessionTimeout}
              onChange={(e) => setSettings({
                ...settings,
                security: { ...settings.security, sessionTimeout: Number(e.target.value) }
              })}
              disabled={!isEditing.security}
              hint="Tiempo antes de que expire automáticamente la sesión"
            />

            <Input
              label="Longitud Mínima de Contraseña"
              type="number"
              value={settings.security.passwordMinLength}
              onChange={(e) => setSettings({
                ...settings,
                security: { ...settings.security, passwordMinLength: Number(e.target.value) }
              })}
              disabled={!isEditing.security}
            />

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Autenticación de Dos Factores</label>
                <p className="text-xs text-gray-500">Requerir 2FA para el acceso de administradores</p>
              </div>
              <button
                type="button"
                disabled={!isEditing.security}
                onClick={() => setSettings({
                  ...settings,
                  security: { ...settings.security, requireTwoFactor: !settings.security.requireTwoFactor }
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.security.requireTwoFactor ? 'bg-blue-600' : 'bg-gray-200'
                } ${!isEditing.security ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.security.requireTwoFactor ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* System Status */}
      <Card>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Cog6ToothIcon className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-medium text-gray-900">Estado del Sistema</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">Activo</div>
              <div className="text-sm text-gray-600">Estado del Sistema</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">v1.0.0</div>
              <div className="text-sm text-gray-600">Versión</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">99.9%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
