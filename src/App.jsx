import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Website from './pages/Website';
import AdminLayout from './admin/layouts/AdminLayout';
import AdminDashboardPage from './admin/pages/DashboardPage';
import StudentsPage from './admin/pages/StudentsPage';
import CoursesPage from './admin/pages/CoursesPage';
import InstructorsPage from './admin/pages/InstructorsPage';
import BookingsPage from './admin/pages/BookingsPage';
import ReportsPage from './admin/pages/ReportsPage';
import SettingsPage from './admin/pages/SettingsPage';
import LoginPage from './admin/pages/LoginPage';
import { AuthProvider } from './admin/auth/AuthContext';
import ProtectedRoute from './admin/auth/ProtectedRoute';
import { ADMIN_ROLE } from './admin/auth/roles';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Website />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute allowedRoles={[ADMIN_ROLE]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="instructors" element={<InstructorsPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
