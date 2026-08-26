export const DEFAULT_PAGE_COPY = {
  homePartnersLabel: 'Our Trusted Partners',
  homePartnersBody: 'Property owners, interior designers, consultants & contractors',
  homeStatsBadge: 'About Us',
  homeStatsTitle: "Dubai's Most Trusted Fitout & Property Transformation Specialists",
  homeStatsBody:
    'Full turnkey execution with certified engineers, in-house joinery, and transparent delivery for homes and commercial spaces.',
  homeServicesBadge: 'Complete Range',
  homeServicesTitle: 'Our Complete Range of Services',
  homeServicesBody: 'From concept to completion — design, fit-out, joinery, and property services under one roof.',
  homeReviewsTitle: 'What Our Clients Say',
  homeMaterialsBadge: 'Experience Center',
  homeMaterialsTitle: 'Material Selection Made Simple',
  homeMaterialsBody:
    'Visit our curated catalog of kitchens, wardrobes, tiles, sanitaryware, flooring, and marble — the same experience-center approach Dubai renovators trust.',
  homeConsultBadge: 'Book Online',
  homeConsultTitle: 'Book a Consultation With Us',
  homeConsultBody:
    'We would love to meet you in person. Share your property details and our planners will prepare a custom proposal with a detailed scope of work — no hidden costs, free basic design for confirmed projects.',
  homeConsultBullets: [
    'Free site visit and transparent quotation',
    '8–10 week average timeline for full home renovation',
    'In-house NOC and authority approvals team',
    'Up to 10-year warranty on kitchens and wardrobes',
  ],
  servicesHeroBadge: 'Architectural Capabilities',
  servicesHeroTitle: 'Renovation & Fit-Out Services',
  servicesHeroBody: 'Discover our comprehensive suite of Dubai residential, commercial, and bespoke joinery services.',
  commercialHeroBadge: 'Commercial Fit-Out Dubai',
  commercialHeroTitle: 'High-Performance Commercial Spaces for Businesses in Dubai',
  commercialHeroSubtitle: 'Offices, clinics, gyms, and retail — rapid execution, technical accuracy, and a premium finish.',
  commercialHeroImage: '',
  commercialSpacesTitle: 'Spaces We Fit Out',
  commercialSpaces: [
    { title: 'Offices & Co-working', body: 'Brand-aligned workspaces with partitions, joinery, lighting, and MEP.' },
    { title: 'Clinics & Wellness', body: 'Authority-ready clinical fit-outs with hygiene finishes and HVAC coordination.' },
    { title: 'Retail & Showrooms', body: 'Customer-facing interiors with custom displays and decorative finishes.' },
    { title: 'Gyms, Salons & F&B', body: 'High-performance commercial spaces built for operations and brand experience.' },
  ],
  commercialFaqTitle: 'Commercial Fit-Out FAQs',
  commercialCtaTitle: 'Start Your Commercial Transformation',
  commercialCtaBody: 'Our team will contact you within 24 hours to schedule a free consultation and site visit.',
  consultBadge: 'Private Appointment',
  consultTitle: 'Book a Design & Renovation Consultation',
  consultSubtitle: 'Meet with our senior Dubai architectural team at your property or in our Design District studio.',
  consultNextTitle: 'What happens next',
  consultNextBody:
    'A planner contacts you within 2 hours, then we schedule a free site visit and prepare a detailed scope of work.',
  consultCards: [
    { title: 'Warranty', body: 'Up to 10 years on kitchens, wardrobes and cabinets.' },
    { title: 'Free basic design', body: '2D and 3D drawings included for confirmed projects.' },
    { title: 'Job applications', body: 'Apply via Careers — inquiry forms are not used for hiring.', link: '/careers' },
  ],
};

export function usePageCopy(settings) {
  return { ...DEFAULT_PAGE_COPY, ...(settings?.pageCopy || {}) };
}
