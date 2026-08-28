export const DEFAULT_PAGE_COPY = {
  homePartnersLabel: 'Our Trusted Partners',
  homePartnersBody: 'Property owners, interior designers, consultants & contractors',
  homeStatsBadge: 'About Us',
  homeStatsTitle: 'Trusted Maintenance & Renovation Specialists in Dubai',
  homeStatsBody:
    'HAMTS delivers maintenance, renovation, painting, and technical services for villas, apartments, and commercial properties across Dubai.',
  homeServicesBadge: 'Complete Range',
  homeServicesTitle: 'Our Complete Range of Services',
  homeServicesBody: 'Maintenance, renovation, painting, carpentry, electrical and fit-out services under one roof.',
  homeExpertiseBadge: 'Technical Services',
  homeExpertiseTitle: 'Maintenance & Renovation Under One Roof',
  homeExpertiseBody:
    'From everyday repairs to complete renovation — skilled tradespeople serving villas, apartments and commercial properties across Dubai.',
  homePromiseBadge: 'Our Promise',
  homePromiseTitle: 'Reliable Service, Every Time',
  homePromiseBody:
    'Transparent pricing, quality workmanship, responsive scheduling, and clear communication from quote to completion.',
  homeProcessBadge: 'How We Work',
  homeProcessTitle: 'How We Deliver Every Project',
  homeProcessBody:
    'Site visit, detailed quotation, scheduled execution, quality checks, and handover — a straightforward process you can trust.',
  homePortfolioTitle: 'Featured Projects',
  homePortfolioBody: 'Recent maintenance, renovation and fit-out work across Dubai.',
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
  commercialHeroBadge: 'Commercial Services Dubai',
  commercialHeroTitle: 'Maintenance & Technical Services for Businesses',
  commercialHeroSubtitle: 'Offices, clinics, retail and commercial buildings — reliable maintenance, renovation, painting and technical works across Dubai.',
  commercialHeroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80',
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
  consultSubtitle: 'Meet our HAMTS team at your property or at our Deira office — Al Murar, Dubai.',
  consultNextTitle: 'What happens next',
  consultNextBody:
    'A planner contacts you within 2 hours, then we schedule a free site visit and prepare a detailed scope of work.',
  consultCards: [
    { title: 'Warranty', body: 'Quality workmanship backed by our service guarantee.' },
    { title: 'Free site visit', body: 'Transparent quotation with no obligation.' },
    { title: 'Job applications', body: 'Apply via Careers — inquiry forms are not used for hiring.', link: '/careers' },
  ],
  reviewsHeroTitle: 'Client Reviews',
  reviewsHeroBody: 'Feedback from property owners and businesses who trust HAMTS for maintenance and renovation.',
  projectsHeroTitle: 'Project Portfolio',
  projectsHeroBody: 'Completed maintenance, renovation and technical services across Dubai.',
  projectsHeroBadge: 'Our Work',
  homeVideoBadge: 'Our Work in Motion',
  homeVideoTitle: 'Project Video Showcase',
  homeVideoBody:
    'Watch our maintenance and renovation projects — see the quality and attention to detail in every job.',
  homeStylesBadge: 'Interior Design Styles',
  homeStylesTitle: 'Styles We Execute',
  homeStylesBody:
    'From contemporary to traditional — explore design directions for villas, apartments and commercial spaces in Dubai.',
  stylesHeroBadge: 'Design Inspiration',
  stylesHeroTitle: 'Interior Design Styles',
  stylesHeroBody: 'Explore design philosophies for residential and commercial properties across Dubai.',
  footerTrustLicensed: 'Licensed UAE Technical Services',
  footerTrustSecure: 'Secure HTTPS & Encrypted Forms',
  footerTrustClients: 'Trusted by homeowners and businesses across Dubai',
  homeCtaCommercial: 'Commercial Services',
  homeCtaCareers: 'Careers',
};

export function usePageCopy(settings) {
  return { ...DEFAULT_PAGE_COPY, ...(settings?.pageCopy || {}) };
}
