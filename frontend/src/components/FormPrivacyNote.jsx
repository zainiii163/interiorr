import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

/** Reassurance shown below lead / consultation forms. */
export default function FormPrivacyNote({ className = '' }) {
  return (
    <p className={`text-[11px] text-stone-500 leading-relaxed flex items-start gap-2 ${className}`}>
      <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-stone-400" aria-hidden="true" />
      <span>
        Your information is encrypted in transit and kept strictly confidential. We use it only to
        respond to your inquiry — never sold or shared with third parties.{' '}
        <Link to="/privacy" className="text-[#C4795A] hover:underline font-semibold">
          Privacy Policy
        </Link>
      </span>
    </p>
  );
}
