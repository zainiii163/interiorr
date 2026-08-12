/**
 * WhatsApp notifications — Phase 3 (Twilio).
 * Phase 1 uses wa.me links from the frontend only.
 */
export function getWhatsAppLink(number, message) {
  const n = String(number).replace(/\D/g, '');
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}