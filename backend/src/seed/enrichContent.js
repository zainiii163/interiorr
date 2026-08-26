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
import { slugify } from '../utils/slugify.js';
import { DEFAULT_PAGE_COPY, SERVICE_IMAGES, REVIEW_PHOTOS } from './pageCopy.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadJson(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', name), 'utf-8'));
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

  console.log('Merging page copy into site settings...');
  let settings = await SiteSetting.findOne();
  if (!settings) settings = await SiteSetting.create({ pageCopy: DEFAULT_PAGE_COPY });
  else {
    settings.pageCopy = { ...DEFAULT_PAGE_COPY, ...(settings.pageCopy || {}) };
    settings.markModified('pageCopy');
    await settings.save();
  }

  console.log('Seeding FAQs if missing...');
  const faqCount = await Faq.countDocuments();
  if (faqCount === 0) {
    await Faq.insertMany(loadJson('faqs.json'));
  } else {
    const faqs = loadJson('faqs.json');
    for (const faq of faqs) {
      await Faq.findOneAndUpdate(
        { question: faq.question },
        { $set: faq },
        { upsert: true }
      );
    }
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
