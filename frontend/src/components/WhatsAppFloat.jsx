import React from 'react';
import WhatsAppIcon from './WhatsAppIcon';
import { useSite } from '../context/SiteContext';

export default function WhatsAppFloat() {
  const { settings } = useSite();
  const whatsappNum = settings.whatsapp?.replace(/\+/g, '').replace(/\s+/g, '');
  if (!whatsappNum) return null;

  return (
    <a
      href={`https://wa.me/${whatsappNum}?text=Hello%20Aura%20Interiors,%20I%20would%20like%20to%20inquire%20about%20a%20renovation%20project.`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xl hover:bg-emerald-500 hover:scale-110 transition-all duration-300 group whatsapp-pulse"
    >
      <WhatsAppIcon className="w-7 h-7" />
      <span className="absolute right-16 bg-stone-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
        Chat on WhatsApp (+971)
      </span>
    </a>
  );
}
