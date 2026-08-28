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
  businessHours: 'Mon - Sat: 8:00 AM - 7:00 PM',
  heroBadge: 'HAMTS · Technical Services Solutions',
  heroTitle: 'Maintenance, Renovation & Interior Solutions in Dubai',
  heroSubtitle:
    'حلول المدينة للخدمات الفنية — Villa, apartment & commercial maintenance, renovation, painting, joinery and reliable technical services across Dubai.',
  heroDescription:
    'Trusted Deira-based team for home maintenance, renovation, painting, carpentry, electrical and fit-out work with transparent pricing.',
  heroTrustBadges: [
    'Licensed UAE Technical Services',
    'Deira · Dubai Based',
    'Maintenance & Renovation Experts',
  ],
  aboutTitle: 'Hulul Al Madina — Your Trusted Technical Services Partner',
  aboutSubtitle: 'حلول المدينة للخدمات الفنية · HAMTS',
  aboutBody:
    'Hulul Al Madina Interiors (HAMTS) provides maintenance, renovation, and interior technical services for villas, apartments, and commercial spaces across Dubai.',
  aboutBullets: [
    'Maintenance, renovation & painting under one roof',
    'Villa, apartment & commercial property services',
    'Transparent quotations and reliable scheduling',
    'Based in Al Murar, Deira — serving all Dubai',
  ],
  certifications: [
    'UAE Technical Services Provider',
    'Dubai Municipality Compliant Works',
    'Residential & Commercial Maintenance',
  ],
  mission:
    'To deliver dependable maintenance and renovation services that keep Dubai properties safe, functional, and beautifully finished.',
  vision:
    'To be the most trusted technical services and interiors brand for homeowners and businesses in Deira and across Dubai.',
  skillsTitle: 'Technical Services We Excel At',
  skillsBody: 'Skilled tradespeople for everyday maintenance and complete renovation projects.',
  ctaBandTitle: 'Reliable Maintenance & Renovation in Dubai',
  ctaBandBody: 'Contact HAMTS for a free site visit and transparent quotation for your property.',
  finalCtaTitle: 'Ready to Start Your Project?',
  finalCtaBody: 'Call or WhatsApp our Deira team — we respond within 2 hours on business days.',
  seo: {
    defaultTitle: 'Hulul Al Madina Interiors | HAMTS Technical Services Dubai',
    defaultDescription:
      'Hulul Al Madina Interiors (HAMTS) — maintenance, renovation and technical services in Deira, Dubai.',
  },
  socialMedia: {
    instagram: INSTAGRAM_URL,
    facebook: FACEBOOK_URL,
    linkedin: '',
    youtube: '',
  },
  socialLinks: {
    instagram: INSTAGRAM_URL,
    facebook: FACEBOOK_URL,
    linkedin: '',
    youtube: '',
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
