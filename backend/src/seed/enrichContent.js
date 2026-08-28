/**
 * Updates marketing content without wiping leads, quotes, or users.
 * Run: npm run seed:enrich
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../config/db.js';
import { Service } from '../models/Service.js';
import { Review } from '../models/Review.js';
import { SiteSetting } from '../models/SiteSetting.js';
import { Faq } from '../models/Faq.js';
import { Partner } from '../models/Partner.js';
import { TrustPillar } from '../models/TrustPillar.js';
import { slugify } from '../utils/slugify.js';
import { DEFAULT_PAGE_COPY, SERVICE_IMAGES, REVIEW_PHOTOS } from './pageCopy.js';
import { BRAND_DEFAULTS } from './brandDefaults.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadJson(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', name), 'utf-8'));
}

function mergePageCopy(existing = {}) {
  const merged = { ...DEFAULT_PAGE_COPY };
  for (const [key, value] of Object.entries(existing)) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value) && value.length === 0) continue;
    merged[key] = value;
  }
  return merged;
}

async function enrich() {
  await connectDB();

  console.log('Updating services (images, features, descriptions)...');
  const servicesData = loadJson('services.json');
  for (const s of servicesData) {
    const slug = slugify(s.title);
    await Service.findOneAndUpdate(
      { slug },
      {
        $set: {
          title: s.title,
          shortDescription: s.shortDescription,
          fullDescription: s.fullDescription || s.shortDescription,
          category: s.category,
          icon: s.icon,
          features: s.features || [],
          isFeatured: Boolean(s.isFeatured),
          order: s.order || 0,
          image: s.image || SERVICE_IMAGES[s.title] || SERVICE_IMAGES['Full Home Renovation'],
          isActive: true,
        },
      },
      { upsert: true, new: true }
    );
  }

  console.log('Merging brand settings and page copy...');
  let settings = await SiteSetting.findOne();
  if (!settings) {
    settings = await SiteSetting.create({
      ...BRAND_DEFAULTS,
      socialLinks: BRAND_DEFAULTS.socialLinks,
      pageCopy: DEFAULT_PAGE_COPY,
    });
  } else {
    Object.assign(settings, {
      ...BRAND_DEFAULTS,
      socialLinks: { ...BRAND_DEFAULTS.socialLinks },
      seo: { ...BRAND_DEFAULTS.seo, ...(settings.seo || {}) },
      pageCopy: mergePageCopy(settings.pageCopy),
    });
    settings.markModified('pageCopy');
    settings.markModified('socialLinks');
    settings.markModified('seo');
    await settings.save();
  }

  console.log('Seeding FAQs if missing...');
  const faqCount = await Faq.countDocuments();
  if (faqCount === 0) {
    await Faq.insertMany(loadJson('faqs.json'));
  } else {
    const faqs = loadJson('faqs.json');
    const seedQuestions = faqs.map((f) => f.question);
    await Faq.updateMany(
      { page: 'commercial', question: { $nin: seedQuestions } },
      { $set: { isActive: false } }
    );
    for (const faq of faqs) {
      await Faq.findOneAndUpdate(
        { question: faq.question },
        { $set: faq },
        { upsert: true }
      );
    }
  }

  console.log('Syncing trust pillars...');
  const pillars = loadJson('trustPillars.json');
  await TrustPillar.deleteMany({});
  await TrustPillar.insertMany(pillars);

  console.log('Updating partner logos...');
  const partners = loadJson('partners.json');
  for (const partner of partners) {
    await Partner.findOneAndUpdate(
      { name: partner.name },
      { $set: { logo: partner.logo, website: partner.website, order: partner.order, isActive: partner.isActive } },
      { upsert: true }
    );
  }

  console.log('Adding review photos where missing...');
  const reviews = await Review.find({ $or: [{ authorPhoto: '' }, { authorPhoto: { $exists: false } }] });
  for (let i = 0; i < reviews.length; i += 1) {
    reviews[i].authorPhoto = REVIEW_PHOTOS[i % REVIEW_PHOTOS.length];
    await reviews[i].save();
  }

  console.log('Enrich complete. Public pages and admin modules are ready.');
  process.exit(0);
}

enrich().catch((err) => {
  console.error(err);
  process.exit(1);
});
