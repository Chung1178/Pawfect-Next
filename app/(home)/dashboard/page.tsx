import ProtectedRoute from '@/app/components/auth/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="container mt-5">
        <h1 className="mb-4">會員儀表板</h1>
        <div className="alert alert-success">
          恭喜！你正在瀏覽一個受保護的頁面。
        </div>
        <p>這裡是只有登入會員才能看到的專屬內容。</p>
      </div>
    </ProtectedRoute>
  );
}
