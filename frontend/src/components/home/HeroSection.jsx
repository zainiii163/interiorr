import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircleMore } from 'lucide-react';
import ScrollReveal from '../ui/ScrollReveal';

export default function HeroSection({ settings }) {
  const whatsapp = settings.whatsapp?.replace(/\+/g, '') || '';
  const heroImage = settings.heroImage;
  const company = settings.companyName || 'Aura';

  return (
    <section className="relative min-h-[100svh] flex items-end sm:items-center overflow-hidden bg-stone-900 text-white">
      <div className="absolute inset-0 z-0">
        {heroImage ? (
          <img src={heroImage} alt="" className="w-full h-full object-cover ken-burns opacity-50" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-900/30" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <ScrollReveal>
          <p className="font-serif text-2xl sm:text-3xl text-[#C4795A] font-semibold mb-4 tracking-tight">
            {company}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-stone-50 max-w-5xl leading-[1.08] mb-6 whitespace-pre-line">
            {settings.heroTitle || "Dubai's Leading Turnkey Fitout, Joinery & Property Transformation Specialists"}
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={180}>
          <p className="text-base sm:text-xl text-stone-300 max-w-2xl font-light leading-relaxed mb-10">
            {settings.heroSubtitle ||
              settings.heroDescription ||
              'Design • Fitout • Joinery • Decorative Finishes • Property Inspection'}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={260}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              to="/consultation"
              className="btn-terracotta text-base font-semibold px-8 py-4 rounded-2xl inline-flex items-center justify-center gap-3 shadow-2xl"
            >
              <span>Book a Free Consultation</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}?text=Hello,%20I%20want%20to%20discuss%20my%20renovation.`}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 rounded-2xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold border border-emerald-500 inline-flex items-center justify-center gap-3 transition shadow-xl"
              >
                <MessageCircleMore className="w-5 h-5" />
                <span>Contact on WhatsApp</span>
              </a>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
