import { Link, NavLink } from 'react-router-dom';
import { APP_NAME } from '../../utils/constants';

const nav = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-neutral-100">
      <div className="container-app flex items-center justify-between h-16">
        <Link to="/" className="font-display text-xl font-semibold text-primary-900">
          {APP_NAME}
        </Link>
        <nav className="hidden lg:flex items-center gap-6">
          {nav.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? 'text-primary-600' : 'text-neutral-800 hover:text-primary-600'}`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/book-consultation"
            className="ml-2 px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600"
          >
            Book Consultation
          </Link>
        </nav>
      </div>
    </header>
  );
}