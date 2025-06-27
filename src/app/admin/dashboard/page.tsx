// app/admin/dashboard/page.tsx

import AdminDashboardContent from '@/components/AdminDashboardContent';
import AuthGuard from '@/components/AuthGuard';

export default function AdminDashboardPage() {
  return (
    // Wrap the dashboard content with AuthGuard for protection
    <AuthGuard requiredRole="admin">
      <AdminDashboardContent />
    </AuthGuard>
  );
}