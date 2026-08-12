import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import MegaMenuPanel from './MegaMenuPanel';
import { useSite } from '../context/SiteContext';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import { resolveMegaMenuChildren, isMegaMenuItem } from '../utils/megaMenu';

function NavLinkItem({ link, isActive, onClick, className }) {
  const isExternal = link.path.startsWith('http://') || link.path.startsWith('https://');

  if (isExternal || link.openInNewTab) {
    return (
      <a href={link.path} target="_blank" rel="noreferrer" onClick={onClick} className={className}>
        {link.label}
      </a>
    );
  }

  return (
    <Link to={link.path} onClick={onClick} className={className}>
      {link.label}
    </Link>
  );
}

function Logo({ settings, onClick }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-3 group min-w-0 shrink-0">
      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#C4795A] to-[#5C7A6B] flex items-center justify-center text-white font-serif font-bold text-xl shadow-xl ring-2 ring-white/20 shrink-0">
        {settings.companyName?.charAt(0) || 'A'}
      </div>
      <div className="min-w-0 hidden sm:block">
        <span className="block font-serif text-xl font-bold tracking-wider text-white group-hover:text-[#C4795A] transition-colors truncate">
          {settings.companyName?.split(' ')[0] || settings.companyName || 'Home'}
        </span>
        {settings.tagline && (
          <span className="block text-[10px] tracking-widest text-stone-400 uppercase font-sans font-semibold truncate max-w-[200px] 2xl:max-w-[280px]">
            {settings.tagline}
          </span>
        )}
      </div>
    </Link>
  );
}

function NavActions({ user, onNavigate }) {
  return (
    <div className="flex items-center gap-3 shrink-0">
      {user && (
        <Link
          to="/admin/dashboard"
          onClick={onNavigate}
          className="hidden 2xl:inline-flex text-xs font-bold px-3 py-2 rounded-lg border border-stone-700 bg-stone-800 text-stone-200 hover:bg-stone-700 transition whitespace-nowrap"
        >
          Dashboard
        </Link>
      )}
      <Link
        to="/consultation"
        onClick={onNavigate}
        className="btn-terracotta text-xs xl:text-sm font-bold px-4 xl:px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-xl shrink-0 whitespace-nowrap"
      >
        <span className="hidden 2xl:inline">Book Consultation</span>
        <span className="2xl:hidden">Book Now</span>
        <ArrowRight className="w-4 h-4 shrink-0" />
      </Link>
    </div>
  );
}

export default function Navbar() {
  const { settings } = useSite();
  const { user } = useAuth();
  const location = useLocation();
  const headerRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navLinks, setNavLinks] = useState([]);
  const [activeMegaId, setActiveMegaId] = useState(null);
  const [megaChildren, setMegaChildren] = useState([]);
  const [mobileExpandedId, setMobileExpandedId] = useState(null);
  const [mobileMegaChildren, setMobileMegaChildren] = useState([]);

  const activeMegaItem = navLinks.find((l) => l._id === activeMegaId);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    apiFetch('/navigation?placement=header')
      .then((res) => {
        if (res.success) setNavLinks(res.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setActiveMegaId(null);
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setActiveMegaId(null);
        setMegaChildren([]);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const updateNavHeight = () => {
      if (headerRef.current) {
        document.documentElement.style.setProperty('--nav-height', `${headerRef.current.offsetHeight}px`);
      }
    };

    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);
    return () => window.removeEventListener('resize', updateNavHeight);
  }, [scrolled, activeMegaId, isOpen, navLinks.length]);

  const openMegaMenu = useCallback(async (item) => {
    if (activeMegaId === item._id) {
      setActiveMegaId(null);
      setMegaChildren([]);
      return;
    }
    const children = await resolveMegaMenuChildren(item);
    setMegaChildren(children);
    setActiveMegaId(item._id);
  }, [activeMegaId]);

  const closeMegaMenu = useCallback(() => {
    setActiveMegaId(null);
    setMegaChildren([]);
  }, []);

  const toggleMobileMega = async (item) => {
    if (mobileExpandedId === item._id) {
      setMobileExpandedId(null);
      setMobileMegaChildren([]);
      return;
    }
    const children = await resolveMegaMenuChildren(item);
    setMobileMegaChildren(children);
    setMobileExpandedId(item._id);
  };

  const linkClass =
    'text-[10px] xl:text-[11px] 2xl:text-xs font-semibold tracking-[0.12em] 2xl:tracking-widest uppercase transition-all duration-200 whitespace-nowrap';

  const renderDesktopNavLinks = () =>
    navLinks.map((link) => {
      const isMega = isMegaMenuItem(link);
      const isActive = location.pathname === link.path || activeMegaId === link._id;
      const isMegaOpen = activeMegaId === link._id;

      if (isMega) {
        return (
          <button
            key={link._id}
            type="button"
            onClick={() => openMegaMenu(link)}
            className={`nav-mega-trigger ${linkClass} ${
              isMegaOpen ? 'open text-white' : isActive ? 'text-[#C4795A]' : 'text-stone-300 hover:text-white'
            }`}
          >
            {link.label}
            {isMegaOpen ? <ChevronUp className="w-3 h-3 shrink-0" /> : <ChevronDown className="w-3 h-3 shrink-0" />}
          </button>
        );
      }

      return (
        <NavLinkItem
          key={link._id}
          link={link}
          isActive={isActive}
          onClick={closeMegaMenu}
          className={`${linkClass} ${isActive ? 'text-[#C4795A] font-bold nav-link-active' : 'text-stone-300 hover:text-white'}`}
        />
      );
    });

  const headerShell = scrolled || activeMegaId
    ? 'bg-stone-900/98 backdrop-blur-xl shadow-2xl py-3 border-b border-stone-800 text-white'
    : 'bg-stone-900/90 backdrop-blur-md py-4 text-white';

  return (
    <>
      <header ref={headerRef} className={`site-header fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${headerShell}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile / tablet */}
          <div className="flex xl:hidden items-center justify-between gap-3 min-w-0">
            <Logo settings={settings} onClick={closeMegaMenu} />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 text-stone-300 hover:text-white rounded-xl focus:outline-none bg-white/5 hover:bg-white/10 transition shrink-0"
              aria-label="Toggle Navigation Menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop — single aligned row */}
          <div className="hidden xl:grid grid-cols-[auto_1fr_auto] items-center gap-4 2xl:gap-8 min-w-0">
            <Logo settings={settings} onClick={closeMegaMenu} />

            {navLinks.length > 0 ? (
              <nav className="flex items-center justify-center gap-3 2xl:gap-5 min-w-0 px-2">
                {renderDesktopNavLinks()}
              </nav>
            ) : (
              <div />
            )}

            <NavActions user={user} onNavigate={closeMegaMenu} />
          </div>
        </div>

        {isOpen && navLinks.length > 0 && (
          <div className="xl:hidden bg-stone-900/98 backdrop-blur-xl border-b border-stone-800 px-4 pt-4 pb-8 space-y-1 max-h-[80vh] overflow-y-auto">
            {navLinks.map((link) => {
              const isMega = isMegaMenuItem(link);
              const expanded = mobileExpandedId === link._id;

              if (isMega) {
                return (
                  <div key={link._id}>
                    <button
                      type="button"
                      onClick={() => toggleMobileMega(link)}
                      className="w-full flex items-center justify-between text-lg font-semibold text-stone-300 hover:text-[#C4795A] py-3 px-4 rounded-xl hover:bg-white/5 transition uppercase tracking-wide"
                    >
                      {link.label}
                      {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    {expanded && (
                      <div className="pl-4 pb-2 space-y-1 border-l border-stone-700 ml-4">
                        {mobileMegaChildren.map((child) => (
                          <Link
                            key={child._id || child.path}
                            to={child.path}
                            onClick={() => setIsOpen(false)}
                            className="block text-sm text-stone-400 hover:text-[#C4795A] py-2 px-3 uppercase tracking-wider"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLinkItem
                  key={link._id}
                  link={link}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-semibold text-stone-300 hover:text-[#C4795A] py-3 px-4 rounded-xl hover:bg-white/5 transition uppercase tracking-wide"
                />
              );
            })}
            <div className="pt-6 border-t border-stone-800 space-y-3">
              {user && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block text-center py-3 rounded-xl border border-stone-700 text-stone-300 font-semibold"
                >
                  Admin Dashboard
                </Link>
              )}
              <Link
                to="/consultation"
                onClick={() => setIsOpen(false)}
                className="w-full btn-terracotta text-center py-4 rounded-xl text-base font-bold block shadow-xl"
              >
                Book Free Consultation
              </Link>
            </div>
          </div>
        )}
      </header>

      {activeMegaId && activeMegaItem && (
        <>
          <div className="mega-menu-backdrop" onClick={closeMegaMenu} aria-hidden="true" />
          <MegaMenuPanel item={activeMegaItem} children={megaChildren} onClose={closeMegaMenu} />
        </>
      )}
    </>
  );
}
