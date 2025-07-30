'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { ScheduleManagement } from '@/components/admin/ScheduleManagement';

export default function SchedulesPage() {
  return (
    <AdminLayout activeSection="schedules">
      <ScheduleManagement />
    </AdminLayout>
  );
}
