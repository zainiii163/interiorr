import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { canAccessPath } from '../../utils/roles';

/** Require login; optionally restrict to listed roles or path-based ROLE_PATHS */
export default function ProtectedRoute({ roles, path }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-500 text-sm">
        Loading…
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  if (roles?.length && !roles.includes(user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (path && !canAccessPath(user.role, path)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}
