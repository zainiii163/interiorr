export function formatPhone(phone) {
  if (!phone) return '';
  return phone.startsWith('+') ? phone : `+${phone}`;
}

export function whatsappLink(number, message = 'Hello, I would like a free consultation.') {
  const n = (number || '').replace(/\D/g, '');
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}