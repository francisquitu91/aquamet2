'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { ReportsManagement } from '@/components/admin/ReportsManagement';

export default function ReportsPage() {
  return (
    <AdminLayout activeSection="reports">
      <ReportsManagement />
    </AdminLayout>
  );
}
