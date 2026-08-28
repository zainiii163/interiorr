import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircleMore, ShieldCheck, Clock } from 'lucide-react';
import ScrollReveal from '../ui/ScrollReveal';

const DEFAULT_BADGES = [
  'Licensed UAE Technical Services',
  'Deira · Dubai Based',
  'Maintenance & Renovation Experts',
];

export default function HeroSection({ settings }) {
  const whatsapp = settings.whatsapp?.replace(/\+/g, '') || '';
  const heroImage = settings.heroImage;
  const company = settings.companyName || 'Hulul Al Madina Interiors';
  const badges =
    settings.heroTrustBadges?.length > 0 ? settings.heroTrustBadges : DEFAULT_BADGES;
  const heroAlt = settings.heroTitle
    ? `${company} — ${settings.heroTitle.replace(/\n/g, ' ').slice(0, 80)}`
    : `${company} interior fit-out and renovation`;

  return (
    <section className="relative min-h-[100svh] flex items-end sm:items-center overflow-hidden bg-stone-900 text-white">
      <div className="absolute inset-0 z-0">
        {heroImage ? (
          <img
            src={heroImage}
            alt={heroAlt}
            className="w-full h-full object-cover ken-burns opacity-50"
            fetchPriority="high"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-900/30" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <ScrollReveal>
          {settings.heroBadge ? (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C4795A]/40 bg-[#C4795A]/10 text-[#C4795A] text-xs font-semibold uppercase tracking-widest mb-5">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              {settings.heroBadge}
            </span>
          ) : (
            <p className="font-serif text-2xl sm:text-3xl text-[#C4795A] font-semibold mb-4 tracking-tight">
              {company}
            </p>
          )}
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-stone-50 max-w-5xl leading-[1.1] mb-6 whitespace-pre-line break-words">
            {settings.heroTitle || "Dubai's Leading Turnkey Fitout, Joinery & Property Transformation Specialists"}
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={180}>
          <p className="text-base sm:text-xl text-stone-300 max-w-2xl font-light leading-relaxed mb-8">
            {settings.heroSubtitle ||
              settings.heroDescription ||
              'Design • Fitout • Joinery • Decorative Finishes • Property Inspection'}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={220}>
          <div className="flex flex-wrap gap-2 mb-10">
            {badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-stone-200"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C4795A]" aria-hidden="true" />
                {badge}
              </span>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={260}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              to="/consultation"
              className="btn-terracotta text-base font-semibold px-8 py-4 rounded-2xl inline-flex items-center justify-center gap-3 shadow-2xl"
            >
              <span>Book a Free Consultation</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}?text=Hello,%20I%20want%20to%20discuss%20my%20renovation.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-2xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold border border-emerald-500 inline-flex items-center justify-center gap-3 transition shadow-xl"
              >
                <MessageCircleMore className="w-5 h-5" aria-hidden="true" />
                <span>WhatsApp Us</span>
              </a>
            )}
          </div>
          <p className="mt-5 inline-flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-400">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C4795A]" aria-hidden="true" />
              Response within 2 hours
            </span>
            <span className="hidden xs:inline text-stone-600">·</span>
            <span>Free site visit · No obligation · Transparent BOQ pricing</span>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

