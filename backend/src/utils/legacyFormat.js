import { DEFAULT_PAGE_COPY } from '../seed/pageCopy.js';

const STATUS_TO_FRONTEND = {
  new: 'New',
  contacted: 'Contacted',
  quoted: 'Quoted',
  won: 'Won',
  lost: 'Lost',
};

const STATUS_FROM_FRONTEND = Object.fromEntries(
  Object.entries(STATUS_TO_FRONTEND).map(([k, v]) => [v, k])
);

const QUOTE_STATUS_TO_FRONTEND = {
  draft: 'Draft',
  sent: 'Sent',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

const QUOTE_STATUS_FROM_FRONTEND = Object.fromEntries(
  Object.entries(QUOTE_STATUS_TO_FRONTEND).map(([k, v]) => [v, k])
);

const CONTACT_TO_FRONTEND = {
  whatsapp: 'WhatsApp',
  phone: 'Phone',
  email: 'Email',
};

const CONTACT_FROM_FRONTEND = {
  WhatsApp: 'whatsapp',
  Phone: 'phone',
  Email: 'email',
  whatsapp: 'whatsapp',
  phone: 'phone',
  email: 'email',
};

function toPlain(doc) {
  if (!doc) return doc;
  return typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
}

function titleCaseCategory(value) {
  if (!value || typeof value !== 'string') return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatService(service) {
  const obj = toPlain(service);
  return {
    ...obj,
    name: obj.title || obj.name,
    heroImage: obj.image || obj.heroImage || '',
    description: obj.fullDescription || obj.description || obj.shortDescription || '',
    category: titleCaseCategory(obj.category),
  };
}

export function parseServiceInput(body = {}) {
  const payload = { ...body };
  if (payload.name && !payload.title) payload.title = payload.name;
  if (payload.heroImage && !payload.image) payload.image = payload.heroImage;
  if (payload.description && !payload.fullDescription) payload.fullDescription = payload.description;
  if (payload.category && typeof payload.category === 'string') {
    payload.category = payload.category.toLowerCase();
  }
  if (typeof payload.features === 'string') {
    payload.features = payload.features.split('\n').map((s) => s.trim()).filter(Boolean);
  }
  delete payload.name;
  delete payload.heroImage;
  delete payload.description;
  return payload;
}

export function formatReview(review) {
  const obj = toPlain(review);
  return {
    ...obj,
    customerName: obj.authorName || obj.customerName,
    reviewText: obj.content || obj.reviewText,
  };
}

export function formatDesignStyle(style) {
  const obj = toPlain(style);
  return {
    ...obj,
    characteristics: obj.traits || obj.characteristics || [],
  };
}

export function formatProject(project) {
  const obj = toPlain(project);
  const before = obj.beforeAfter?.before;
  const after = obj.beforeAfter?.after;
  return {
    ...obj,
    beforeImages: before ? [before] : obj.beforeImages || [],
    afterImages: after ? [after] : obj.afterImages || [],
    category: titleCaseCategory(obj.category),
  };
}

export function formatSettings(settings) {
  const obj = toPlain(settings);
  const stats = obj.stats || {};
  const social = obj.socialLinks || {};
  const hasGoogleKey = Boolean(obj.googleApiKey && String(obj.googleApiKey).trim());
  // Never expose the raw API key on public/admin GET responses
  delete obj.googleApiKey;
  return {
    ...obj,
    companyName: obj.companyName || 'Hulul Al Madina Interiors',
    socialLinks: social,
    socialMedia: social,
    googleApiKeyConfigured: hasGoogleKey,
    statistics: {
      yearsExperience: stats.yearsExperience ?? 0,
      completedProjects: stats.projectsCompleted ?? 0,
      teamMembers: stats.employees ?? 0,
      propertyInspections: stats.inspections ?? 0,
      customerRating: stats.averageRating ?? 0,
    },
    seo: obj.seo || {},
    heroTrustBadges: obj.heroTrustBadges || [],
    aboutBullets: obj.aboutBullets || [],
    certifications: obj.certifications || [],
    skills: obj.skills || [],
    pageCopy: { ...DEFAULT_PAGE_COPY, ...(obj.pageCopy && typeof obj.pageCopy === 'object' ? obj.pageCopy : {}) },
  };
}

export function parseSettingsInput(body = {}) {
  const payload = { ...body };
  if (payload.statistics && typeof payload.statistics === 'object') {
    payload.stats = {
      ...(payload.stats || {}),
      yearsExperience: payload.statistics.yearsExperience,
      projectsCompleted: payload.statistics.completedProjects,
      employees: payload.statistics.teamMembers,
      inspections: payload.statistics.propertyInspections,
      averageRating: payload.statistics.customerRating,
    };
    delete payload.statistics;
  }
  if (payload.socialMedia && !payload.socialLinks) {
    payload.socialLinks = payload.socialMedia;
    delete payload.socialMedia;
  }
  // Empty / placeholder key must not wipe a stored secret
  if (!payload.googleApiKey || !String(payload.googleApiKey).trim()) {
    delete payload.googleApiKey;
  }
  delete payload.googleApiKeyConfigured;
  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) delete payload[key];
  });
  return payload;
}

export function formatLead(lead) {
  const obj = toPlain(lead);
  const service =
    obj.service && typeof obj.service === 'object'
      ? obj.service.title || obj.service.name || obj.service
      : obj.service;

  return {
    ...obj,
    status: STATUS_TO_FRONTEND[obj.status] || obj.status,
    propertyType: titleCaseCategory(obj.propertyType),
    preferredContactMethod:
      CONTACT_TO_FRONTEND[obj.preferredContact] || obj.preferredContactMethod || 'WhatsApp',
    service,
    notes: (obj.notes || []).map((note) => {
      const n = toPlain(note);
      return {
        ...n,
        content: n.text || n.content,
        author: typeof n.author === 'object' ? n.author?.name || 'Staff' : n.author || 'Staff',
      };
    }),
  };
}

export function parseLeadInput(body = {}) {
  const payload = { ...body };
  if (payload.status && STATUS_FROM_FRONTEND[payload.status]) {
    payload.status = STATUS_FROM_FRONTEND[payload.status];
  }
  if (payload.preferredContactMethod) {
    payload.preferredContact =
      CONTACT_FROM_FRONTEND[payload.preferredContactMethod] ||
      String(payload.preferredContactMethod).toLowerCase();
    delete payload.preferredContactMethod;
  } else if (payload.preferredContact) {
    payload.preferredContact =
      CONTACT_FROM_FRONTEND[payload.preferredContact] ||
      String(payload.preferredContact).toLowerCase();
  }
  if (payload.propertyType && typeof payload.propertyType === 'string') {
    payload.propertyType = payload.propertyType.toLowerCase();
  }
  if (payload.note) {
    payload.content = payload.note;
  }
  return payload;
}

export function formatQuote(quote) {
  const obj = toPlain(quote);
  const lead = obj.lead && typeof obj.lead === 'object' ? obj.lead : {};
  const items = (obj.lineItems || obj.items || []).map((item) => ({
    ...item,
    lineTotal: item.total ?? item.lineTotal ?? (item.quantity || 1) * (item.unitPrice || 0),
  }));

  return {
    ...obj,
    leadId: lead._id || obj.lead,
    leadName: lead.fullName || obj.leadName || '',
    leadEmail: lead.email || obj.leadEmail || '',
    items,
    status: QUOTE_STATUS_TO_FRONTEND[obj.status] || obj.status,
  };
}

export function parseQuoteInput(body = {}) {
  const payload = { ...body };
  if (payload.leadId && !payload.lead) payload.lead = payload.leadId;
  if (payload.items && !payload.lineItems) {
    payload.lineItems = payload.items.map((item) => ({
      description: item.description,
      category: item.category,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.lineTotal ?? (item.quantity || 1) * (item.unitPrice || 0),
    }));
  }
  if (payload.status && QUOTE_STATUS_FROM_FRONTEND[payload.status]) {
    payload.status = QUOTE_STATUS_FROM_FRONTEND[payload.status];
  }
  if (payload.lead) {
    delete payload.leadName;
    delete payload.leadEmail;
  }
  delete payload.leadId;
  delete payload.items;
  return payload;
}

export function normalizeLeadStatusFilter(status) {
  return STATUS_FROM_FRONTEND[status] || status?.toLowerCase?.() || status;
}

export function parseProjectInput(body = {}) {
  const payload = { ...body };
  if (payload.category && typeof payload.category === 'string') {
    payload.category = payload.category.toLowerCase();
  }
  const before = payload.beforeImages?.[0] || payload.beforeImage || payload.beforeAfter?.before;
  const after = payload.afterImages?.[0] || payload.afterImage || payload.beforeAfter?.after;
  if (before || after) {
    payload.beforeAfter = { before: before || '', after: after || '' };
  }
  delete payload.beforeImages;
  delete payload.afterImages;
  delete payload.beforeImage;
  delete payload.afterImage;
  return payload;
}

export function parseReviewInput(body = {}) {
  const payload = { ...body };
  if (payload.customerName && !payload.authorName) payload.authorName = payload.customerName;
  if (payload.reviewText && !payload.content) payload.content = payload.reviewText;
  delete payload.customerName;
  delete payload.reviewText;
  return payload;
}

export function parseDesignStyleInput(body = {}) {
  const payload = { ...body };
  if (payload.characteristics && !payload.traits) {
    payload.traits = Array.isArray(payload.characteristics)
      ? payload.characteristics
      : String(payload.characteristics)
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
  }
  delete payload.characteristics;
  return payload;
}
