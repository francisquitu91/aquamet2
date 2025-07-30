'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { StudentManagement } from '@/components/admin/StudentManagement';

export default function StudentsPage() {
  return (
    <AdminLayout activeSection="students">
      <StudentManagement />
    </AdminLayout>
  );
}
