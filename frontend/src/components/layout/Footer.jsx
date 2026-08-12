import { Link } from 'react-router-dom';
import { APP_NAME } from '../../utils/constants';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-100 mt-auto">
      <div className="container-app py-12 grid md:grid-cols-3 gap-8">
        <div>
          <p className="font-display text-lg font-semibold">{APP_NAME}</p>
          <p className="text-sm text-neutral-400 mt-2">Turnkey fit-out & renovation in Dubai.</p>
        </div>
        <div>
          <p className="font-medium mb-3">Quick links</p>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li><Link to="/services" className="hover:text-white">Services</Link></li>
            <li><Link to="/projects" className="hover:text-white">Projects</Link></li>
            <li><Link to="/book-consultation" className="hover:text-white">Book Consultation</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-medium mb-3">Admin</p>
          <Link to="/admin/login" className="text-sm text-neutral-400 hover:text-white">Staff login</Link>
        </div>
      </div>
      <div className="border-t border-neutral-800 py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} {APP_NAME}. Architecture scaffold.
      </div>
    </footer>
  );
}