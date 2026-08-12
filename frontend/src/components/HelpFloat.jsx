import { Phone } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function HelpFloat() {
  const { settings } = useSite();
  const phone = settings.phone;
  if (!phone) return null;

  const tel = phone.replace(/[^\d+]/g, '');

  return (
    <a
      href={`tel:${tel}`}
      aria-label={`Call ${phone}`}
      className="fixed bottom-24 right-6 z-50 hidden sm:flex items-center gap-3 pl-4 pr-5 py-3 rounded-full bg-stone-900 text-white shadow-2xl border border-stone-700 hover:border-[#C4795A] hover:scale-[1.02] transition-all group"
    >
      <span className="w-9 h-9 rounded-full bg-[#C4795A] flex items-center justify-center">
        <Phone className="w-4 h-4" />
      </span>
      <span className="text-left leading-tight">
        <span className="block text-[10px] uppercase tracking-widest text-stone-400 group-hover:text-[#C4795A]">
          Need any help?
        </span>
        <span className="block text-sm font-semibold">{phone}</span>
      </span>
    </a>
  );
}
