import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, Layers, FolderKanban,
  Settings, LogOut, ArrowLeft, Star, Handshake, Palette, Shield,
  ShieldCheck, Briefcase, ClipboardList, Compass, TrendingUp,
  Package, Image as ImageIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { canAccessPath, roleLabel } from '../utils/roles';
import { useSite } from '../context/SiteContext';

const ALL_NAV = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Analytics & Revenue', path: '/admin/analytics', icon: TrendingUp },
  { name: 'Leads & Inquiries', path: '/admin/leads', icon: Users },
  { name: 'Job Openings', path: '/admin/job-openings', icon: Briefcase },
  { name: 'Job Applications', path: '/admin/applications', icon: ClipboardList },
  { name: 'Quotations', path: '/admin/quotes', icon: FileText },
  { name: 'Services', path: '/admin/services', icon: Layers },
  { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
  { name: 'Design Styles', path: '/admin/design-styles', icon: Palette },
  { name: 'Materials', path: '/admin/materials', icon: Package },
  { name: 'Media Library', path: '/admin/media', icon: ImageIcon },
  { name: 'Trust Pillars', path: '/admin/trust-pillars', icon: ShieldCheck },
  { name: 'Reviews', path: '/admin/reviews', icon: Star },
  { name: 'Partners', path: '/admin/partners', icon: Handshake },
  { name: 'Navigation', path: '/admin/navigation', icon: Compass },
  { name: 'Site Settings', path: '/admin/settings', icon: Settings },
  { name: 'User Management', path: '/admin/users', icon: Shield },
];

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const { settings } = useSite();
  const navigate = useNavigate();
  const location = useLocation();
  const brandName = settings?.companyName?.split(' ')[0] || 'AURA';
  const brandInitial = brandName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center text-stone-500 text-sm">
        Loading staff portal...
      </div>
    );
  }

  if (!user) return null;

  // Block deep-links to pages outside this role's matrix
  if (
    location.pathname !== '/admin' &&
    !canAccessPath(user.role, location.pathname) &&
    !location.pathname.startsWith('/admin/login')
  ) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = ALL_NAV.filter((item) => canAccessPath(user.role, item.path));

  const portalSubtitle =
    user.role === 'admin'
      ? 'FULL ACCESS'
      : user.role === 'manager'
        ? 'SALES & OPS'
        : 'CONTENT CMS';

  return (
    <div className="min-h-screen bg-stone-100 flex font-sans">
      <aside className="w-64 bg-stone-900 text-stone-300 flex flex-col border-r border-stone-800">
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#C4795A] text-white flex items-center justify-center font-serif font-bold">
              {brandInitial}
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-white">{brandName}</span>
              <span className="block text-[9px] uppercase tracking-widest text-stone-400">
                {portalSubtitle}
              </span>
            </div>
          </Link>
        </div>

        <div className="p-4 bg-stone-950/60 border-b border-stone-800 flex items-center space-x-3 text-xs">
          <div className="w-8 h-8 rounded-full bg-stone-800 text-[#C4795A] font-bold flex items-center justify-center uppercase">
            {user.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <div className="font-semibold text-stone-200 truncate">{user.name}</div>
            <div className="text-stone-400 text-[10px] tracking-wider">{roleLabel(user.role)}</div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-[#C4795A] text-white shadow-md'
                    : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-stone-800 space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-2 text-xs font-medium text-stone-400 hover:text-white px-3 py-2 rounded-lg hover:bg-stone-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View Public Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 text-xs font-medium text-rose-400 hover:text-rose-300 px-3 py-2 rounded-lg hover:bg-rose-950/20 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
