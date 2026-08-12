export const APP_NAME = import.meta.env.VITE_SITE_NAME || 'Interior Platform';
export const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '971550000000';

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