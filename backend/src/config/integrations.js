import { env } from './env.js';
import { isCloudinaryConfigured } from './cloudinary.js';

export function getIntegrationStatus() {
  const emailReady = Boolean(env.smtp.user && env.smtp.pass);
  const stripeReady = Boolean(env.stripe.secretKey);
  const googleReady = Boolean(env.google.placesApiKey && env.google.placeId);

  return {
    mongodb: { configured: true, label: 'MongoDB' },
    cloudinary: {
      configured: isCloudinaryConfigured(),
      label: 'Cloudinary (image uploads)',
      hint: isCloudinaryConfigured()
        ? 'Ready'
        : 'Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in backend/.env',
    },
    email: {
      configured: emailReady,
      label: 'SMTP (lead notifications)',
      hint: emailReady
        ? `Sending to ${env.adminEmail}`
        : 'Set SMTP_USER and SMTP_PASS in backend/.env',
    },
    stripe: {
      configured: stripeReady,
      label: 'Stripe (payments)',
      hint: stripeReady
        ? 'Live checkout enabled'
        : 'Set STRIPE_SECRET_KEY in backend/.env (sandbox mode active without it)',
    },
    googleReviews: {
      configured: googleReady,
      label: 'Google Places (reviews sync)',
      hint: googleReady
        ? 'Live API sync enabled'
        : 'Set GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in backend/.env or Site Settings',
    },
  };
}

export function logIntegrationStatus() {
  const status = getIntegrationStatus();
  console.log('\n--- Integration status ---');
  for (const [key, item] of Object.entries(status)) {
    if (key === 'mongodb') continue;
    const icon = item.configured ? 'OK' : 'MISSING';
    console.log(`  [${icon}] ${item.label}: ${item.hint}`);
  }
  console.log('--------------------------\n');
}
