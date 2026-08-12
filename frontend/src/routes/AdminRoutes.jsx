import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/admin/ProtectedRoute';
import AdminLayout from '../components/admin/AdminLayout';

import LoginPage from '../pages/admin/LoginPage';
import DashboardPage from '../pages/admin/DashboardPage';
import LeadsPage from '../pages/admin/LeadsPage';
import ServicesAdminPage from '../pages/admin/ServicesAdminPage';
import ProjectsAdminPage from '../pages/admin/ProjectsAdminPage';
import ReviewsAdminPage from '../pages/admin/ReviewsAdminPage';
import SettingsPage from '../pages/admin/SettingsPage';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="services" element={<ServicesAdminPage />} />
          <Route path="projects" element={<ProjectsAdminPage />} />
          <Route path="reviews" element={<ReviewsAdminPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}