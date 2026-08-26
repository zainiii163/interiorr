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
import { Material } from '../models/Material.js';
import { Media } from '../models/Media.js';
import { Faq } from '../models/Faq.js';
import { slugify } from '../utils/slugify.js';
import { DEFAULT_PAGE_COPY, SERVICE_IMAGES, REVIEW_PHOTOS } from './pageCopy.js';

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
    Material.deleteMany({}),
    Media.deleteMany({}),
    Faq.deleteMany({}),
  ]);

  console.log('Creating admin user...');
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@interior.com',
    password: 'Admin@123',
    role: 'admin',
  });

  console.log('Creating manager user...');
  const manager = await User.create({
    name: 'Sales Manager',
    email: 'manager@interior.com',
    password: 'Manager@123',
    role: 'manager',
  });

  console.log('Creating editor user...');
  await User.create({
    name: 'Editor',
    email: 'editor@interior.com',
    password: 'Editor@123',
    role: 'editor',
  });

  console.log('Seeding services...');
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

  console.log('Seeding design styles...');
  const styleImages = [
    'https://images.unsplash.com/photo-1618221195710-dd6b41fa6046?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
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

  console.log('Seeding trust pillars...');
  await TrustPillar.insertMany(loadJson('trustPillars.json'));

  console.log('Seeding reviews...');
  const reviewSeeds = [
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
  ];
  await Review.insertMany(
    reviewSeeds.map((r, i) => ({ ...r, authorPhoto: REVIEW_PHOTOS[i % REVIEW_PHOTOS.length] }))
  );

  console.log('Seeding partners...');
  await Partner.insertMany([
    { name: 'Bosch', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch-logo.svg', website: 'https://bosch.com', order: 1, isActive: true },
    { name: 'Blum', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Blum_logo.svg', website: 'https://blum.com', order: 2, isActive: true },
    { name: 'Grohe', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/GROHE_logo.svg', website: 'https://grohe.com', order: 3, isActive: true },
    { name: 'Dulux', logo: 'https://upload.wikimedia.org/wikipedia/en/7/7e/Dulux_logo.svg', website: 'https://dulux.com', order: 4, isActive: true },
  ]);

  console.log('Seeding projects...');
  const projects = await Project.insertMany([
    {
      title: 'Dubai Creek Harbour Villa',
      slug: 'dubai-creek-harbour-villa',
      description: 'Full turnkey villa renovation including design, procurement, permits, and execution.',
      category: 'residential',
      location: 'Dubai Creek Harbour',
      coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      beforeAfter: {
        before: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        after: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      },
      gallery: [
        { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', caption: 'Living lounge' },
        { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', caption: 'Kitchen' },
        { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41fa6046?w=800', caption: 'Master suite' },
      ],
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
      beforeAfter: {
        before: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800',
        after: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      },
      gallery: [
        { url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800', caption: 'Custom kitchen' },
        { url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800', caption: 'Bathroom' },
      ],
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
      gallery: [
        { url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800', caption: 'Open workspace' },
        { url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800', caption: 'Boardroom' },
      ],
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
      gallery: [
        { url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', caption: 'Boutique floor' },
      ],
      scope: 'Retail fit-out, display joinery',
      duration: '6 weeks',
      isFeatured: true,
      isPublished: true,
      completedAt: new Date('2026-01-10'),
    },
    {
      title: 'JLT Wellness Clinic',
      slug: 'jlt-wellness-clinic',
      description: 'Authority-ready clinic fit-out with hygienic finishes, HVAC coordination, and custom joinery.',
      category: 'commercial',
      location: 'Jumeirah Lakes Towers',
      coverImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
      gallery: [
        { url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800', caption: 'Treatment suite' },
      ],
      scope: 'Clinical fit-out, MEP, joinery',
      duration: '8 weeks',
      isFeatured: true,
      isPublished: true,
      completedAt: new Date('2026-03-01'),
    },
  ]);

  // Link first design styles to related projects
  const styles = await DesignStyle.find().sort({ createdAt: 1 }).limit(4);
  if (styles[0] && projects[0]) {
    styles[0].relatedProjects = [projects[0]._id, projects[1]._id];
    await styles[0].save();
  }
  if (styles[1] && projects[1]) {
    styles[1].relatedProjects = [projects[1]._id, projects[2]._id];
    await styles[1].save();
  }
  if (projects[0] && styles[0]) {
    await Project.findByIdAndUpdate(projects[0]._id, { designStyle: styles[0]._id });
  }
  if (projects[1] && styles[1]) {
    await Project.findByIdAndUpdate(projects[1]._id, { designStyle: styles[1]._id });
  }

  console.log('Seeding materials...');
  await Material.insertMany([
    {
      name: 'Italian Carrara Marble',
      slug: slugify('Italian Carrara Marble'),
      category: 'marble',
      subcategory: 'Natural Stone',
      description: 'Premium Italian Carrara marble with classic white background and grey veining. Perfect for luxury interiors.',
      images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
      specifications: {
        origin: 'Italy',
        finish: 'Polished',
        thickness: '20mm',
        size: '600x600mm',
      },
      pricePerUnit: 450,
      unit: 'sqm',
      inStock: true,
      isFeatured: true,
      order: 1,
      isActive: true,
    },
    {
      name: 'European Oak Hardwood',
      slug: slugify('European Oak Hardwood'),
      category: 'flooring',
      subcategory: 'Hardwood',
      description: 'Premium European oak hardwood flooring with natural grain patterns. Engineered construction for stability.',
      images: ['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800'],
      specifications: {
        origin: 'Europe',
        finish: 'Matte Lacquer',
        thickness: '15mm',
        width: '180mm',
      },
      pricePerUnit: 380,
      unit: 'sqm',
      inStock: true,
      isFeatured: true,
      order: 2,
      isActive: true,
    },
    {
      name: 'Porcelain Tiles - Concrete Look',
      slug: slugify('Porcelain Tiles - Concrete Look'),
      category: 'tiles',
      subcategory: 'Porcelain',
      description: 'Modern porcelain tiles with concrete texture effect. Durable and low maintenance for contemporary spaces.',
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
      specifications: {
        origin: 'Spain',
        finish: 'Matt',
        thickness: '10mm',
        size: '600x600mm',
      },
      pricePerUnit: 120,
      unit: 'sqm',
      inStock: true,
      isFeatured: false,
      order: 3,
      isActive: true,
    },
    {
      name: 'Brushed Gold Fixtures Set',
      slug: slugify('Brushed Gold Fixtures Set'),
      category: 'fixtures',
      subcategory: 'Bathroom',
      description: 'Luxury brushed gold bathroom fixture set including faucet, shower head, and accessories.',
      images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800'],
      specifications: {
        origin: 'Germany',
        finish: 'Brushed Gold',
        material: 'Brass',
        warranty: '10 years',
      },
      pricePerUnit: 2500,
      unit: 'set',
      inStock: true,
      isFeatured: true,
      order: 4,
      isActive: true,
    },
    {
      name: 'Emperador Dark Marble',
      slug: slugify('Emperador Dark Marble'),
      category: 'marble',
      subcategory: 'Natural Stone',
      description: 'Rich dark brown Spanish marble with lighter veining. Creates dramatic and elegant interiors.',
      images: ['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800'],
      specifications: {
        origin: 'Spain',
        finish: 'Honed',
        thickness: '20mm',
        size: '800x800mm',
      },
      pricePerUnit: 520,
      unit: 'sqm',
      inStock: true,
      isFeatured: false,
      order: 5,
      isActive: true,
    },
    {
      name: 'Large Format Porcelain Slabs',
      slug: slugify('Large Format Porcelain Slabs'),
      category: 'tiles',
      subcategory: 'Porcelain',
      description: 'Extra-large porcelain slabs for seamless surfaces. Minimal grout lines for modern aesthetic.',
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
      specifications: {
        origin: 'Italy',
        finish: 'Glossy',
        thickness: '6mm',
        size: '1200x2400mm',
      },
      pricePerUnit: 280,
      unit: 'sqm',
      inStock: false,
      isFeatured: false,
      order: 6,
      isActive: true,
    },
  ]);

  console.log('Seeding home media (video showcase)...');
  await Media.insertMany([
    {
      type: 'video',
      title: 'Villa Transformation Showcase',
      url: 'https://www.youtube.com/embed/ScMzIvxBSi4',
      thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      placement: 'home',
      order: 1,
    },
    {
      type: 'video',
      title: 'Craftsmanship & Joinery',
      url: 'https://www.youtube.com/embed/aqz-KE-bpKQ',
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      placement: 'home',
      order: 2,
    },
    {
      type: 'image',
      title: 'Studio Atmosphere',
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41fa6046?w=1200',
      thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41fa6046?w=400',
      placement: 'about',
      order: 1,
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
    heroBadge: "Dubai's Premier Turnkey Fitout & Joinery",
    heroTitle: "Dubai's Leading Turnkey Fitout, Joinery & Property Transformation Specialists",
    heroSubtitle: 'Design • Fitout • Joinery • Decorative Finishes • Property Inspection • Authority Approvals',
    heroDescription: 'Transforming Dubai luxury homes and commercial spaces with certified engineers and in-house joinery.',
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
    certifications: [
      'Dubai Municipality Approved Contractor',
      'DEWA Registered Electrical Works',
      'Civil Defence Fire Safety Compliant',
      'Trakhees / DDA Fit-Out Approvals',
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
    pageCopy: DEFAULT_PAGE_COPY,
  });

  console.log('Seeding FAQs...');
  await Faq.insertMany(loadJson('faqs.json'));

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
      status: 'quoted',
      assignedTo: manager._id,
    },
    {
      fullName: 'Omar Hassan',
      email: 'omar@example.com',
      phone: '+971502223344',
      propertyType: 'apartment',
      service: services[1]?._id || services[0]._id,
      location: 'Downtown Dubai',
      message: 'Kitchen and living room fit-out quote needed.',
      preferredContact: 'whatsapp',
      source: 'Website Hero CTA',
      leadType: 'consultation',
      status: 'new',
      assignedTo: manager._id,
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
      assignedTo: admin._id,
    },
  ]);

  console.log('Seeding sample quote...');
  const sampleLead = await Lead.findOne({ email: 'sarah@example.com' });
  if (sampleLead) {
    await Quote.create({
      quoteNumber: `Q-${new Date().getFullYear()}-0001`,
      accessCode: 'P-8F92A1C3',
      lead: sampleLead._id,
      lineItems: [
        { description: 'Design & planning', quantity: 1, unitPrice: 15000, total: 15000 },
        { description: 'Joinery & finishes', quantity: 1, unitPrice: 85000, total: 85000 },
      ],
      subtotal: 100000,
      tax: 5000,
      discount: 0,
      grandTotal: 105000,
      status: 'sent',
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
    { label: 'Commercial', path: '/commercial', order: 4, placement: 'header', isActive: true, menuType: 'link' },
    {
      label: 'Projects',
      path: '/projects',
      order: 5,
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
      order: 6,
      placement: 'header',
      isActive: true,
      menuType: 'mega',
      megaMenuSource: 'design-styles',
      megaMenuTitle: 'Design Styles',
      megaMenuCtaLabel: 'Explore Styles',
      megaMenuCtaPath: '/design-styles',
    },
    { label: 'Reviews', path: '/reviews', order: 7, placement: 'header', isActive: true, menuType: 'link' },
    { label: 'Materials', path: '/materials', order: 8, placement: 'header', isActive: true, menuType: 'link' },
    { label: 'Careers', path: '/careers', order: 9, placement: 'header', isActive: true, menuType: 'link' },
    { label: 'Contact', path: '/contact', order: 10, placement: 'header', isActive: true, menuType: 'link' },
    { label: 'About', path: '/about', order: 1, placement: 'footer', isActive: true },
    { label: 'Commercial Fit-Out', path: '/commercial', order: 2, placement: 'footer', isActive: true },
    { label: 'Project Portfolio', path: '/projects', order: 3, placement: 'footer', isActive: true },
    { label: 'Design Styles', path: '/design-styles', order: 4, placement: 'footer', isActive: true },
    { label: 'Materials', path: '/materials', order: 5, placement: 'footer', isActive: true },
    { label: 'Client Reviews', path: '/reviews', order: 6, placement: 'footer', isActive: true },
    { label: 'Book Consultation', path: '/consultation', order: 7, placement: 'footer', isActive: true },
    { label: 'Client Portal', path: '/portal', order: 8, placement: 'footer', isActive: true },
    { label: 'Careers', path: '/careers', order: 9, placement: 'footer', isActive: true },
  ]);

  console.log('\nSeed complete.');
  console.log('Admin login:   admin@interior.com / Admin@123');
  console.log('Manager login: manager@interior.com / Manager@123');
  console.log('Editor login:  editor@interior.com / Editor@123');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});