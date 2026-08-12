import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

function createTransport() {
  if (!env.smtp.user || !env.smtp.pass) return null;
  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: false,
    auth: { user: env.smtp.user, pass: env.smtp.pass },
  });
}

export async function sendAdminLeadAlert(lead) {
  const transport = createTransport();
  if (!transport) {
    console.log('[email skipped] Admin lead alert:', lead.fullName, lead.email);
    return;
  }

  const isContact = lead.leadType === 'contact';
  const subject = isContact
    ? `New contact inquiry: ${lead.fullName}`
    : `New consultation lead: ${lead.fullName}`;

  await transport.sendMail({
    from: env.smtp.user,
    to: env.adminEmail,
    subject,
    text: `Type: ${lead.leadType || 'consultation'}\nName: ${lead.fullName}\nEmail: ${lead.email}\nPhone: ${lead.phone}\nLocation: ${lead.location || '-'}\nMessage: ${lead.message || '-'}\nSource: ${lead.source || '-'}`,
  });
}

export async function sendClientConfirmation(lead) {
  const transport = createTransport();
  if (!transport) {
    console.log('[email skipped] Client confirmation:', lead.email);
    return;
  }

  const isContact = lead.leadType === 'contact';
  const subject = isContact
    ? 'We received your message'
    : 'We received your consultation request';
  const intro = isContact
    ? 'Thank you for reaching out. Our team will respond shortly.'
    : 'Thank you for booking a consultation. Our team will reach out shortly.';

  await transport.sendMail({
    from: env.smtp.user,
    to: lead.email,
    subject,
    text: `Hi ${lead.fullName},\n\n${intro}\n\n— Interior Platform`,
  });
}

export async function sendJobApplicationAlert(application) {
  const transport = createTransport();
  if (!transport) {
    console.log('[email skipped] Job application:', application.fullName, application.position);
    return;
  }

  await transport.sendMail({
    from: env.smtp.user,
    to: env.adminEmail,
    subject: `New job application: ${application.position} — ${application.fullName}`,
    text: `Position: ${application.position}\nName: ${application.fullName}\nEmail: ${application.email}\nPhone: ${application.phone}\nExperience: ${application.experience || '-'}\nResume: ${application.resumeUrl || '-'}\n\nCover letter:\n${application.coverLetter || '-'}`,
  });
}