import AdminLayout from '../layouts/AdminLayout';

/**
 * [PHÂN CÔNG: BẢO - Nhánh feat/bao-admin-report-users]
 * Nhiệm vụ: Trang Admin xem danh sách người dùng và khóa/mở khóa tài khoản.
 */
function UsersManagePage() {
  return (
    <AdminLayout title="Quản lý người dùng">
      <div className="panel-card" style={{ padding: '24px' }}>
        <p>TODO [Bảo]: Kết nối API /api/v1/admin/users.</p>
      </div>
    </AdminLayout>
  );
}

export default UsersManagePage;
