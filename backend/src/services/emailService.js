import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

function createTransport() {
  if (!env.smtp.user || !env.smtp.pass) return null;
  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: { user: env.smtp.user, pass: env.smtp.pass },
  });
}

function wrapHtml(title, body) {
  return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;padding:20px">
    <div style="border-bottom:3px solid #C4795A;padding-bottom:12px;margin-bottom:20px">
      <strong style="font-size:18px;color:#C4795A">AURA Interiors</strong>
    </div>
    <h2 style="color:#1c1917;font-size:16px">${title}</h2>
    ${body}
    <p style="color:#78716c;font-size:12px;margin-top:30px;border-top:1px solid #e7e5e4;padding-top:12px">
      This is an automated message from Hulul Al Madina Interiors (HAMTS).
    </p>
  </body></html>`;
}

async function sendMail({ to, subject, text, html }) {
  const transport = createTransport();
  if (!transport) {
    console.log(`[email skipped] ${subject} → ${to}`);
    return false;
  }
  await transport.sendMail({ from: `"AURA Interiors" <${env.smtp.user}>`, to, subject, text, html });
  return true;
}

export async function sendAdminLeadAlert(lead) {
  const isContact = lead.leadType === 'contact';
  const subject = isContact
    ? `New contact inquiry: ${lead.fullName}`
    : `New consultation lead: ${lead.fullName}`;

  const rows = [
    ['Type', lead.leadType || 'consultation'],
    ['Name', lead.fullName],
    ['Email', lead.email],
    ['Phone', lead.phone],
    ['Location', lead.location || '-'],
    ['Message', lead.message || '-'],
    ['Source', lead.source || '-'],
  ];

  const htmlRows = rows.map(([k, v]) => `<tr><td style="padding:6px 12px;font-weight:bold;color:#78716c">${k}</td><td style="padding:6px 12px">${v}</td></tr>`).join('');

  return sendMail({
    to: env.adminEmail,
    subject,
    text: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
    html: wrapHtml(subject, `<table style="border-collapse:collapse;width:100%">${htmlRows}</table>`),
  });
}

export async function sendClientConfirmation(lead) {
  const isContact = lead.leadType === 'contact';
  const subject = isContact ? 'We received your message' : 'Your consultation request is confirmed';
  const intro = isContact
    ? 'Thank you for reaching out. Our team will respond within 24 hours.'
    : 'Thank you for booking a consultation. A design specialist will contact you shortly.';

  return sendMail({
    to: lead.email,
    subject,
    text: `Hi ${lead.fullName},\n\n${intro}\n\n— AURA Interiors`,
    html: wrapHtml(
      subject,
      `<p>Hi <strong>${lead.fullName}</strong>,</p><p>${intro}</p><p>Best regards,<br><strong>AURA Interiors Team</strong></p>`
    ),
  });
}

export async function sendJobApplicationAlert(application) {
  const subject = `New job application: ${application.position} — ${application.fullName}`;
  return sendMail({
    to: env.adminEmail,
    subject,
    text: `Position: ${application.position}\nName: ${application.fullName}\nEmail: ${application.email}\nPhone: ${application.phone}`,
    html: wrapHtml(subject, `<p><strong>${application.fullName}</strong> applied for <strong>${application.position}</strong>.</p><p>Email: ${application.email}<br>Phone: ${application.phone}</p>`),
  });
}

export async function sendQuoteToClient({ quote, lead, portalUrl, companyName = 'AURA Interiors' }) {
  if (!lead?.email) return false;
  const subject = `Your quotation ${quote.quoteNumber} from ${companyName}`;
  const total = `${(quote.grandTotal || 0).toLocaleString()} ${quote.currency || 'AED'}`;
  const text = `Hi ${lead.fullName},\n\nYour quotation ${quote.quoteNumber} is ready.\nTotal: ${total}\nAccess code: ${quote.accessCode || quote.quoteNumber}\nPortal: ${portalUrl}\n\n— ${companyName}`;
  const html = wrapHtml(
    subject,
    `<p>Hi <strong>${lead.fullName}</strong>,</p>
     <p>Your quotation <strong>${quote.quoteNumber}</strong> is ready for review.</p>
     <p><strong>Grand total:</strong> ${total}</p>
     <p><strong>Client access code:</strong> ${quote.accessCode || quote.quoteNumber}</p>
     <p><a href="${portalUrl}" style="display:inline-block;background:#C4795A;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold">Open Client Portal</a></p>
     <p>You can accept the quote and pay securely from the portal.</p>`
  );
  return sendMail({ to: lead.email, subject, text, html });
}

export async function sendCustomerVerification({ to, name, verifyUrl }) {
  const subject = 'Please verify your email address';
  const text = `Hi ${name},\n\nPlease verify your email to activate your account by clicking the link below:\n${verifyUrl}\n\n— AURA Interiors`;
  const html = wrapHtml(
    subject,
    `<p>Hi <strong>${name}</strong>,</p>
     <p>Thanks for creating your account. Please verify your email to activate it.</p>
     <p><a href="${verifyUrl}" style="display:inline-block;background:#C4795A;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold">Verify my email</a></p>
     <p style="color:#78716c;font-size:12px">This link expires in 24 hours. If you didn't create this account, you can ignore this email.</p>`
  );
  return sendMail({ to, subject, text, html });
}
