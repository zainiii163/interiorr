import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, Outlet, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, Layers, FolderKanban,
  Settings, LogOut, ArrowLeft, Star, Handshake, Palette, Shield,
  ShieldCheck, Briefcase, ClipboardList, Compass, TrendingUp,
  Package, Image as ImageIcon, HelpCircle, Type, Menu, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { canAccessPath, roleLabel } from '../utils/roles';
import { useSite } from '../context/SiteContext';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Analytics & Revenue', path: '/admin/analytics', icon: TrendingUp },
    ],
  },
  {
    label: 'CRM',
    items: [
      { name: 'Leads & Inquiries', path: '/admin/leads', icon: Users },
      { name: 'Quotations', path: '/admin/quotes', icon: FileText },
      { name: 'Job Openings', path: '/admin/job-openings', icon: Briefcase },
      { name: 'Job Applications', path: '/admin/applications', icon: ClipboardList },
    ],
  },
  {
    label: 'Website content',
    items: [
      { name: 'Page Copy', path: '/admin/pages', icon: Type },
      { name: 'FAQs', path: '/admin/faqs', icon: HelpCircle },
      { name: 'Services', path: '/admin/services', icon: Layers },
      { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
      { name: 'Design Styles', path: '/admin/design-styles', icon: Palette },
      { name: 'Materials', path: '/admin/materials', icon: Package },
      { name: 'Media Library', path: '/admin/media', icon: ImageIcon },
      { name: 'Trust Pillars', path: '/admin/trust-pillars', icon: ShieldCheck },
      { name: 'Reviews', path: '/admin/reviews', icon: Star },
      { name: 'Partners', path: '/admin/partners', icon: Handshake },
      { name: 'Navigation', path: '/admin/navigation', icon: Compass },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Site Settings', path: '/admin/settings', icon: Settings },
      { name: 'User Management', path: '/admin/users', icon: Shield },
    ],
  },
];

function SidebarContent({ sections, location, brandInitial, brandName, portalSubtitle, user, onNavigate, onLogout }) {
  return (
    <>
      <div className="p-4 sm:p-6 border-b border-stone-800 flex items-center justify-between">
        <Link to="/" onClick={onNavigate} className="flex items-center space-x-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#C4795A] text-white flex items-center justify-center font-serif font-bold shrink-0">
            {brandInitial}
          </div>
          <div className="min-w-0">
            <span className="font-serif font-bold text-lg text-white block truncate">{brandName}</span>
            <span className="block text-[9px] uppercase tracking-widest text-stone-400">{portalSubtitle}</span>
          </div>
        </Link>
      </div>

      <div className="p-4 bg-stone-950/60 border-b border-stone-800 flex items-center space-x-3 text-xs">
        <div className="w-8 h-8 rounded-full bg-stone-800 text-[#C4795A] font-bold flex items-center justify-center uppercase shrink-0">
          {user.name?.charAt(0) || 'U'}
        </div>
        <div className="overflow-hidden min-w-0">
          <div className="font-semibold text-stone-200 truncate">{user.name}</div>
          <div className="text-stone-400 text-[10px] tracking-wider">{roleLabel(user.role)}</div>
        </div>
      </div>

      <nav className="flex-1 p-3 sm:p-4 space-y-5 overflow-y-auto overscroll-contain">
        {sections.map((section) => (
          <div key={section.label}>
            <div className="px-3 sm:px-4 mb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-stone-500">
              {section.label}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={onNavigate}
                    className={`flex items-center space-x-3 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-[#C4795A] text-white shadow-md'
                        : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-stone-800 space-y-2 shrink-0">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center space-x-2 text-xs font-medium text-stone-400 hover:text-white px-3 py-2 rounded-lg hover:bg-stone-800 transition"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>View Public Website</span>
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center space-x-2 text-xs font-medium text-rose-400 hover:text-rose-300 px-3 py-2 rounded-lg hover:bg-rose-950/20 transition"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Log Out</span>
        </button>
      </div>
    </>
  );
}

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const { settings } = useSite();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const brandName = settings?.companyName?.split(' ')[0] || 'AURA';
  const brandInitial = brandName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center text-stone-500 text-sm px-4">
        Loading staff portal...
      </div>
    );
  }

  if (!user) return null;

  if (
    location.pathname !== '/admin' &&
    !canAccessPath(user.role, location.pathname) &&
    !location.pathname.startsWith('/admin/login')
  ) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
    navigate('/admin/login');
  };

  const sections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => canAccessPath(user.role, item.path)),
  })).filter((section) => section.items.length > 0);

  const portalSubtitle =
    user.role === 'admin'
      ? 'FULL ACCESS'
      : user.role === 'manager'
        ? 'SALES & OPS'
        : 'CONTENT CMS';

  const sidebarProps = {
    sections,
    location,
    brandInitial,
    brandName,
    portalSubtitle,
    user,
    onNavigate: () => setMobileOpen(false),
    onLogout: handleLogout,
  };

  return (
    <div className="min-h-screen bg-stone-100 flex font-sans">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-stone-900 text-stone-300 flex-col border-r border-stone-800 shrink-0">
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-stone-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[min(100vw-3rem,18rem)] bg-stone-900 text-stone-300 flex flex-col border-r border-stone-800 transform transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-3 p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent {...sidebarProps} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-3 bg-stone-900 text-white border-b border-stone-800">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-stone-800 shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1 text-center">
            <span className="font-serif font-bold text-sm truncate block">{brandName}</span>
            <span className="text-[9px] uppercase tracking-widest text-stone-400">{portalSubtitle}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-stone-800 text-[#C4795A] font-bold flex items-center justify-center uppercase text-xs shrink-0">
            {user.name?.charAt(0) || 'U'}
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
