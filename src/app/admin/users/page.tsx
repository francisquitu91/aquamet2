import { AdminLayout } from '@/components/admin/AdminLayout';
import { UserManagement } from '@/components/admin/UserManagement';

export default function UsersPage() {
  return (
    <AdminLayout activeSection="users">
      <UserManagement />
    </AdminLayout>
  );
}
