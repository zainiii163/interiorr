import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/User.js';
import { Service } from '../models/Service.js';
import { DesignStyle } from '../models/DesignStyle.js';
import { TrustPillar } from '../models/TrustPillar.js';
import { Review } from '../models/Review.js';
import { Partner } from '../models/Partner.js';
import { Project } from '../models/Project.js';
import { SiteSetting } from '../models/SiteSetting.js';
import { Lead } from '../models/Lead.js';
import { Quote } from '../models/Quote.js';
import { JobApplication } from '../models/JobApplication.js';
import { JobOpening } from '../models/JobOpening.js';
import { NavItem } from '../models/NavItem.js';
import { Faq } from '../models/Faq.js';
import { Membership } from '../models/Membership.js';
import { slugify } from '../utils/slugify.js';
import { DEFAULT_PAGE_COPY, SERVICE_IMAGES } from './pageCopy.js';
import { BRAND_DEFAULTS, MEMBERSHIP_DEFAULTS } from './brandDefaults.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadJson(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', name), 'utf-8'));
}

export async function seedData() {
  console.log('Seeding initial system data...');

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@interior.com',
    password: 'Admin@123',
    role: 'admin',
  });

  await User.create({
    name: 'Editor',
    email: 'editor@interior.com',
    password: 'Editor@123',
    role: 'editor',
  });

  const servicesData = loadJson('services.json');
  const services = await Service.insertMany(
    servicesData.map((s) => ({
      ...s,
      slug: slugify(s.title),
      fullDescription: s.fullDescription || s.shortDescription,
      image: s.image || SERVICE_IMAGES[s.title] || SERVICE_IMAGES['Full Home Renovation'],
      isActive: true,
    }))
  );

  const styleImages = [
    'https://images.unsplash.com/photo-1618221195710-dd6b41fa6046?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
  ];
  const stylesData = loadJson('designStyles.json');
  await DesignStyle.insertMany(
    stylesData.map((s, index) => ({
      ...s,
      slug: slugify(s.name),
      description: s.description || `${s.tagline}. A refined interior style executed to perfection.`,
      image: styleImages[index % styleImages.length],
      isActive: true,
    }))
  );

  await TrustPillar.insertMany(loadJson('trustPillars.json'));

  await Review.insertMany([
    {
      authorName: 'Sheikh Mansoor Al-Hassan',
      authorTitle: 'Villa Owner, Palm Jumeirah',
      rating: 5,
      content: 'Exceptional maintenance and renovation work! HAMTS transformed our villa with reliable painting, carpentry and finishing. Completed ahead of schedule.',
      source: 'google',
      authorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      isFeatured: true,
      isPublished: true,
    },
    {
      authorName: 'Elena Rostova',
      authorTitle: 'Penthouse Client, Downtown Dubai',
      rating: 5,
      content: 'The 3D design visualisations were spot on, and execution exceeded expectations.',
      source: 'google',
      authorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isFeatured: true,
      isPublished: true,
    },
  ]);

  await SiteSetting.create({
    ...BRAND_DEFAULTS,
    socialLinks: BRAND_DEFAULTS.socialLinks,
    pageCopy: DEFAULT_PAGE_COPY,
  });

  await Faq.insertMany(loadJson('faqs.json'));

  await Membership.insertMany(MEMBERSHIP_DEFAULTS);
  console.log('Memberships seeded.');

  const lead = await Lead.create({
    fullName: 'Sarah Al Maktoum',
    email: 'sarah@example.com',
    phone: '+971501112233',
    propertyType: 'villa',
    service: services[0]._id,
    location: 'Palm Jumeirah',
    message: 'Interested in full villa renovation.',
    preferredContact: 'whatsapp',
    source: 'Consultation Booking Page',
    leadType: 'consultation',
    status: 'quoted',
  });

  await Quote.create({
    quoteNumber: 'Q-2026-0001',
    accessCode: 'P-8F92',
    lead: lead._id,
    lineItems: [
      { description: 'Design Approval & 3D Renderings', category: 'Design', quantity: 1, unitPrice: 15000, total: 15000 },
      { description: 'Custom Italian Joinery & Cabinetry', category: 'Joinery', quantity: 1, unitPrice: 85000, total: 85000 },
      { description: 'MEP Electrical & Linear Slot AC Diffusers', category: 'MEP', quantity: 1, unitPrice: 20000, total: 20000 },
    ],
    subtotal: 120000,
    tax: 6000,
    discount: 5000,
    grandTotal: 121000,
    currency: 'AED',
    status: 'sent',
    paymentStatus: 'unpaid',
    createdBy: admin._id,
  });

  console.log('Auto-seed completed successfully!');
}
