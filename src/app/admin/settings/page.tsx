'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { SettingsManagement } from '@/components/admin/SettingsManagement';

export default function SettingsPage() {
  return (
    <AdminLayout activeSection="settings">
      <SettingsManagement />
    </AdminLayout>
  );
}
