import { whatsappLink } from '../../utils/formatters';
import { WHATSAPP } from '../../utils/constants';

export default function WhatsAppFab() {
  return (
    <a
      href={whatsappLink(WHATSAPP)}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
      aria-label="Contact on WhatsApp"
    >
      <span className="text-2xl">💬</span>
    </a>
  );
}