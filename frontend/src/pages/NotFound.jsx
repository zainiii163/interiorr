import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound({ admin = false }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center px-4 ${admin ? 'min-h-[60vh]' : 'pt-32 pb-24 min-h-[70vh]'}`}>
      <p className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest mb-2">404</p>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 mb-4">
        Page Not Found
      </h1>
      <p className="text-stone-600 text-sm max-w-md mb-8">
        {admin
          ? 'This admin section does not exist or has not been built yet.'
          : 'The page you are looking for may have been moved or no longer exists.'}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to={admin ? '/admin/dashboard' : '/'}
          className="btn-terracotta px-6 py-3 rounded-xl text-xs font-semibold flex items-center gap-2"
        >
          {admin ? <ArrowLeft className="w-4 h-4" /> : <Home className="w-4 h-4" />}
          {admin ? 'Back to Dashboard' : 'Return Home'}
        </Link>
        {!admin && (
          <Link
            to="/contact"
            className="px-6 py-3 rounded-xl text-xs font-semibold border border-stone-300 text-stone-700 hover:bg-stone-50"
          >
            Contact Us
          </Link>
        )}
      </div>
    </div>
  );
}
