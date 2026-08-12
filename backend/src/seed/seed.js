import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../config/db.js';
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
import { slugify } from '../utils/slugify.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadJson(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', name), 'utf-8'));
}

async function seed() {
  await connectDB();

  console.log('Clearing collections...');
  await Promise.all([
    User.deleteMany({}),
    Service.deleteMany({}),
    DesignStyle.deleteMany({}),
    TrustPillar.deleteMany({}),
    Review.deleteMany({}),
    Partner.deleteMany({}),
    Project.deleteMany({}),
    SiteSetting.deleteMany({}),
    Lead.deleteMany({}),
    Quote.deleteMany({}),
    JobApplication.deleteMany({}),
    JobOpening.deleteMany({}),
    NavItem.deleteMany({}),
  ]);

  console.log('Creating admin user...');
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@interior.com',
    password: 'Admin@123',
    role: 'admin',
  });

  console.log('Creating editor user...');
  await User.create({
    name: 'Editor',
    email: 'editor@interior.com',
    password: 'Editor@123',
    role: 'editor',
  });

  console.log('Seeding services...');
  const serviceImages = {
    'Villa Renovation': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    'Full Home Renovation': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    'Kitchen Renovation': 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80',
    'Bathroom Renovation': 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80',
    'Bespoke Joinery': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'Property Inspection': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
  };
  const servicesData = loadJson('services.json');
  const services = await Service.insertMany(
    servicesData.map((s) => ({
      ...s,
      slug: slugify(s.title),
      fullDescription: s.shortDescription,
      image: serviceImages[s.title] || 'https://images.unsplash.com/photo-1618221195710-dd6b41fa6046?auto=format&fit=crop&w=1200&q=80',
      isActive: true,
    }))
  );

  console.log('Seeding design styles...');
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
      description: `${s.tagline}. A refined interior style executed to perfection.`,
      image: styleImages[index % styleImages.length],
      isActive: true,
    }))
  );

  console.log('Seeding trust pillars...');
  const promisePillars = loadJson('trustPillars.json').map((p) => ({ ...p, section: 'promise' }));
  await TrustPillar.insertMany([
    ...promisePillars,
    {
      title: 'Carpentry & Joinery',
      description: '25+ years experience • 75 skilled craftsmen • 15,000 sq.ft Al Quoz facility • Value engineering for every budget.',
      icon: 'Hammer',
      section: 'expertise',
      order: 1,
    },
    {
      title: 'Turnkey Fit-Outs',
      description: 'From palaces to penthouses, hotels to retail — one-stop design, procurement, permits and execution.',
      icon: 'Building2',
      section: 'expertise',
      order: 2,
    },
    {
      title: 'Decorative Finishes',
      description: 'In-house artisans for microcement, terrazzo, decorative paints and specialty wall treatments.',
      icon: 'Paintbrush',
      section: 'expertise',
      order: 3,
    },
    {
      title: 'Design Hub',
      description: 'We collaborate with leading designers and connect them to our exclusive VIP clientele across Dubai.',
      icon: 'Users',
      section: 'expertise',
      order: 4,
    },
  ]);

  console.log('Seeding reviews...');
  await Review.insertMany([
    {
      authorName: 'Timur G',
      authorTitle: 'Property Owner',
      rating: 5,
      content:
        'Halo-level turnkey renovation delivered to a stunning standard. Honest dealings, transparent pricing, and exceptional quality control.',
      source: 'google',
      isFeatured: true,
      isPublished: true,
    },
    {
      authorName: 'AJ Boelens',
      authorTitle: 'Homeowner',
      rating: 5,
      content:
        'Professional property inspection and renovation guidance. Honest, reliable, and the only team we would trust again.',
      source: 'google',
      isFeatured: true,
      isPublished: true,
    },
    {
      authorName: 'Mansi Shah',
      authorTitle: 'Villa Owner',
      rating: 5,
      content:
        'Extremely professional and reliable. Extra effort on every requirement. We recommend them without hesitation.',
      source: 'google',
      isFeatured: true,
      isPublished: true,
    },
    {
      authorName: 'Limelight Interiors',
      authorTitle: 'Design Partner',
      rating: 5,
      content:
        'Exceptional quality and service across three projects. Premium joinery speaks for itself.',
      source: 'google',
      isFeatured: true,
      isPublished: true,
    },
  ]);

  console.log('Seeding partners...');
  await Partner.insertMany([
    { name: 'Bosch', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch-logo.svg', website: 'https://bosch.com', order: 1, isActive: true },
    { name: 'Blum', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Blum_logo.svg', website: 'https://blum.com', order: 2, isActive: true },
    { name: 'Grohe', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/GROHE_logo.svg', website: 'https://grohe.com', order: 3, isActive: true },
    { name: 'Dulux', logo: 'https://upload.wikimedia.org/wikipedia/en/7/7e/Dulux_logo.svg', website: 'https://dulux.com', order: 4, isActive: true },
  ]);

  console.log('Seeding projects...');
  await Project.insertMany([
    {
      title: 'Dubai Creek Harbour Villa',
      slug: 'dubai-creek-harbour-villa',
      description: 'Full turnkey villa renovation including design, procurement, permits, and execution.',
      category: 'residential',
      location: 'Dubai Creek Harbour',
      coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      scope: 'Design, joinery, MEP, finishes',
      duration: '10 weeks',
      isFeatured: true,
      isPublished: true,
      completedAt: new Date('2025-06-01'),
      serviceTypes: [services[0]._id, services[4]._id],
    },
    {
      title: 'Marina Apartment Refresh',
      slug: 'marina-apartment-refresh',
      description: 'Kitchen, bathrooms, and full interior upgrade for a waterfront apartment.',
      category: 'residential',
      location: 'Dubai Marina',
      coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      scope: 'Kitchen, bathrooms, flooring',
      duration: '8 weeks',
      isFeatured: true,
      isPublished: true,
      completedAt: new Date('2025-09-15'),
      serviceTypes: [services[2]._id, services[3]._id],
    },
    {
      title: 'Business Bay Office Fit-Out',
      slug: 'business-bay-office-fitout',
      description: 'Commercial office fit-out with custom joinery and MEP coordination.',
      category: 'commercial',
      location: 'Business Bay',
      coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      scope: 'Fit-out, joinery, lighting',
      duration: '12 weeks',
      isFeatured: true,
      isPublished: true,
      completedAt: new Date('2025-11-20'),
      serviceTypes: [services[7]._id, services[4]._id],
    },
    {
      title: 'Retail Boutique DIFC',
      slug: 'retail-boutique-difc',
      description: 'High-end retail interior with decorative finishes and custom displays.',
      category: 'retail',
      location: 'DIFC',
      coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      scope: 'Retail fit-out, display joinery',
      duration: '6 weeks',
      isFeatured: true,
      isPublished: true,
      completedAt: new Date('2026-01-10'),
    },
  ]);

  console.log('Seeding site settings...');
  await SiteSetting.create({
    companyName: 'Aura Luxury Interiors & Renovations Dubai',
    tagline: 'Bespoke Fit-Out, Joinery & Architectural Renovation in Dubai',
    phone: '+971 4 800 9988',
    whatsapp: '971501234567',
    email: 'info@aurainteriors.ae',
    address: 'Design District (D3), Building 4, Suite 302, Dubai, UAE',
    businessHours: 'Mon - Sat: 8:00 AM - 7:00 PM',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Design+District+D3+Dubai+UAE&output=embed',
    socialLinks: {
      instagram: 'https://www.instagram.com/',
      facebook: 'https://www.facebook.com/',
      linkedin: 'https://www.linkedin.com/',
    },
    stats: {
      yearsExperience: 14,
      projectsCompleted: 350,
      employees: 45,
      inspections: 820,
      averageRating: 4.9,
    },
    seo: {
      defaultTitle: 'Aura Luxury Interiors & Renovations Dubai | Turnkey Fit-Out & Joinery',
      defaultDescription: 'Luxury interior design, renovation, joinery and fit-out services in Dubai.',
    },
    heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80',
    heroBadge: "Dubai's Premier Turnkey Renovation & Joinery",
    heroTitle: 'Crafting Bespoke Luxury Interiors Across Dubai',
    heroSubtitle: 'Design • Fitout • Joinery • Decorative Finishes • Property Inspection • Authority Approvals',
    heroDescription: 'From Palm Jumeirah villas to Downtown penthouses — full turnkey execution with certified engineers and in-house joinery.',
    heroTrustBadges: [
      'DDA & Municipality Approved',
      '10-Year Structural Warranty',
      '15,000 sq.ft Joinery Factory',
    ],
    aboutTitle: 'Transforming Residences into Architectural Masterpieces Since 2012',
    aboutSubtitle: "Dubai's leading interior fit-out, bespoke joinery, and architectural contracting firm.",
    aboutBody: 'Founded in Dubai, Aura Luxury Interiors provides full end-to-end renovation services encompassing interior architecture, custom joinery fabrication in our private Dubai workshop, MEP engineering, and official authority permits.',
    aboutBullets: [
      'In-House Cabinetry & Millwork Workshop in Dubai',
      'Dedicated Project Managers & Thermal Snagging Engineers',
      'Full Transparency with Detailed BOQ & Fixed Timeline Guarantee',
    ],
    aboutImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    mission: 'To deliver world-class turnkey interior fit-outs with uncompromising craftsmanship, transparent communication, and flawless Dubai authority approvals.',
    vision: 'To remain the most trusted interior renovation and joinery brand across the United Arab Emirates.',
    skillsTitle: 'Skills That Shape Your Dream Home',
    skillsBody: 'Our dedicated team of designers and project engineers works closely with you to understand your vision and bring it to life.',
    skills: [
      { label: 'Space Planning & Layout', value: 95 },
      { label: 'Project Challenges & Solutions', value: 85 },
      { label: 'Sustainability & Eco-Friendly Features', value: 75 },
      { label: 'Authority Approvals & NOCs', value: 90 },
    ],
    ctaBandTitle: "Dubai's Trusted Fit-Out Specialists",
    ctaBandBody: 'For property owners, investors & designers — book a free site visit and receive a transparent quote.',
    ctaBandImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=80',
    finalCtaTitle: 'Ready to Transform Your Property?',
    finalCtaBody: 'Schedule an in-person consultation with our senior Dubai team today.',
  });

  console.log('Seeding job openings...');
  await JobOpening.insertMany([
    {
      title: 'Senior Interior Architect',
      type: 'Full Time',
      location: 'Dubai Design District (D3)',
      description: 'Lead luxury villa renovation concepts and technical AutoCAD / 3D Max drawings.',
      order: 1,
      isActive: true,
    },
    {
      title: 'Joinery Workshop Foreman',
      type: 'Full Time',
      location: 'Al Quoz Industrial, Dubai',
      description: 'Oversee custom CNC wood cutting, veneering, and assembly in our private factory.',
      order: 2,
      isActive: true,
    },
    {
      title: 'Property Snagging & MEP Inspector',
      type: 'Full Time',
      location: 'Dubai, UAE',
      description: 'Conduct thermal imaging and comprehensive architectural handover audits for client villas.',
      order: 3,
      isActive: true,
    },
  ]);

  console.log('Seeding sample leads...');
  await Lead.insertMany([
    {
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
      status: 'new',
    },
    {
      fullName: 'James Wilson',
      email: 'james@example.com',
      phone: '+971504445566',
      message: 'Please call me about your kitchen packages.',
      preferredContact: 'phone',
      source: 'Contact Page Form',
      leadType: 'contact',
      status: 'contacted',
    },
  ]);

  console.log('Seeding sample quote...');
  const sampleLead = await Lead.findOne({ email: 'sarah@example.com' });
  if (sampleLead) {
    await Quote.create({
      quoteNumber: `Q-${new Date().getFullYear()}-0001`,
      lead: sampleLead._id,
      lineItems: [
        { description: 'Design & planning', quantity: 1, unitPrice: 15000, total: 15000 },
        { description: 'Joinery & finishes', quantity: 1, unitPrice: 85000, total: 85000 },
      ],
      subtotal: 100000,
      tax: 5000,
      discount: 0,
      grandTotal: 105000,
      status: 'draft',
      createdBy: admin._id,
    });
  }

  console.log('Seeding navigation...');
  await NavItem.insertMany([
    { label: 'Home', path: '/', order: 1, placement: 'header', isActive: true, menuType: 'link' },
    { label: 'About', path: '/about', order: 2, placement: 'header', isActive: true, menuType: 'link' },
    {
      label: 'Services',
      path: '/services',
      order: 3,
      placement: 'header',
      isActive: true,
      menuType: 'mega',
      megaMenuSource: 'services',
      megaMenuTitle: 'Services',
      megaMenuCtaLabel: 'Explore Services',
      megaMenuCtaPath: '/services',
    },
    {
      label: 'Projects',
      path: '/projects',
      order: 4,
      placement: 'header',
      isActive: true,
      menuType: 'mega',
      megaMenuSource: 'projects',
      megaMenuTitle: 'Portfolio',
      megaMenuCtaLabel: 'View All Projects',
      megaMenuCtaPath: '/projects',
    },
    {
      label: 'Styles',
      path: '/design-styles',
      order: 5,
      placement: 'header',
      isActive: true,
      menuType: 'mega',
      megaMenuSource: 'design-styles',
      megaMenuTitle: 'Design Styles',
      megaMenuCtaLabel: 'Explore Styles',
      megaMenuCtaPath: '/design-styles',
    },
    { label: 'Reviews', path: '/reviews', order: 6, placement: 'header', isActive: true, menuType: 'link' },
    { label: 'Careers', path: '/careers', order: 7, placement: 'header', isActive: true, menuType: 'link' },
    { label: 'Contact', path: '/contact', order: 8, placement: 'header', isActive: true, menuType: 'link' },
    { label: 'About', path: '/about', order: 1, placement: 'footer', isActive: true },
    { label: 'Our Services', path: '/services', order: 2, placement: 'footer', isActive: true },
    { label: 'Project Portfolio', path: '/projects', order: 3, placement: 'footer', isActive: true },
    { label: 'Design Styles', path: '/design-styles', order: 4, placement: 'footer', isActive: true },
    { label: 'Client Reviews', path: '/reviews', order: 5, placement: 'footer', isActive: true },
    { label: 'Careers', path: '/careers', order: 6, placement: 'footer', isActive: true },
  ]);

  console.log('\nSeed complete.');
  console.log('Admin login: admin@interior.com / Admin@123');
  console.log('Editor login: editor@interior.com / Editor@123');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});