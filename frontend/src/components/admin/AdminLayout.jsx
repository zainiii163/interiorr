import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/leads', label: 'Leads' },
  { to: '/admin/services', label: 'Services' },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/reviews', label: 'Reviews' },
  { to: '/admin/settings', label: 'Settings' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-neutral-100">
      <aside className="w-64 bg-neutral-900 text-white flex flex-col">
        <div className="p-6 border-b border-neutral-800">
          <p className="font-display font-semibold">Admin CMS</p>
          <p className="text-xs text-neutral-400 mt-1">{user?.email}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-primary-600' : 'hover:bg-neutral-800'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="m-4 py-2 text-sm text-neutral-400 hover:text-white text-left"
        >
          Log out
        </button>
      </aside>
      <div className="flex-1 p-8 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}