/** Public contact defaults from Vite env (HAMTS). CMS settings override these at runtime. */
export const APP_NAME = import.meta.env.VITE_SITE_NAME || 'Hulul Al Madina Interiors';
export const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '971561787007';
export const CONTACT_PHONE = import.meta.env.VITE_CONTACT_PHONE || '+971 56 178 7007';
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'hello.hamts@yahoo.com';
export const CONTACT_ADDRESS =
  import.meta.env.VITE_CONTACT_ADDRESS ||
  'Office No. 277-18-2, Al Murar, Deira Dubai, United Arab Emirates';
export const INSTAGRAM_URL =
  import.meta.env.VITE_INSTAGRAM_URL ||
  'https://www.instagram.com/hululalmadina?igsi=MWw5ZWkxZGp2MGNqMg==';
export const FACEBOOK_URL =
  import.meta.env.VITE_FACEBOOK_URL || 'https://www.facebook.com/share/1K6NUaGN8y/';

export const ENV_SITE_DEFAULTS = {
  companyName: APP_NAME,
  tagline: 'Maintenance • Renovation • Reliable Solutions',
  phone: CONTACT_PHONE,
  whatsapp: WHATSAPP,
  email: CONTACT_EMAIL,
  address: CONTACT_ADDRESS,
  logoUrl: '/logo.jpg',
  socialMedia: {
    instagram: INSTAGRAM_URL,
    facebook: FACEBOOK_URL,
    linkedin: '',
  },
  socialLinks: {
    instagram: INSTAGRAM_URL,
    facebook: FACEBOOK_URL,
    linkedin: '',
  },
};

export const PROPERTY_TYPES = [
  { value: 'villa', label: 'Villa' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'office', label: 'Office' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'retail', label: 'Retail' },
  { value: 'other', label: 'Other' },
];

export const PROJECT_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'retail', label: 'Retail' },
];

export const LEAD_STATUSES = ['new', 'contacted', 'quoted', 'won', 'lost'];
