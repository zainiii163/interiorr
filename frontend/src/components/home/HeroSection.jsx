import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircleMore, Sparkles, ShieldCheck, Award, Building, Star } from 'lucide-react';
import ScrollReveal from '../ui/ScrollReveal';

const BADGE_ICONS = [ShieldCheck, Award, Building, Star];

export default function HeroSection({ settings, reviewCount = 0, avgRating = 0 }) {
  const whatsapp = settings.whatsapp?.replace(/\+/g, '') || '';
  const heroImage = settings.heroImage;
  const trustBadges = settings.heroTrustBadges || [];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-stone-900 text-white">
      <div className="absolute inset-0 z-0">
        {heroImage && (
          <img src={heroImage} alt="" className="w-full h-full object-cover ken-burns opacity-45" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/75 to-stone-900/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(26,24,23,0.4)_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        {settings.heroBadge && (
          <ScrollReveal>
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#C4795A]/20 border border-[#C4795A]/40 text-[#C4795A] text-xs font-semibold uppercase tracking-widest mb-8 animate-float">
              <Sparkles className="w-4 h-4" />
              <span>{settings.heroBadge}</span>
            </div>
          </ScrollReveal>
        )}

        {settings.heroTitle && (
          <ScrollReveal delay={120}>
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-stone-50 max-w-6xl mx-auto leading-[1.08] mb-8 whitespace-pre-line">
              {settings.heroTitle}
            </h1>
          </ScrollReveal>
        )}

        <ScrollReveal delay={220}>
          {settings.heroSubtitle && (
            <p className="text-lg sm:text-2xl text-stone-300 max-w-4xl mx-auto font-light leading-relaxed mb-6">
              {settings.heroSubtitle}
            </p>
          )}
          {settings.heroDescription && (
            <p className="text-base text-stone-400 max-w-3xl mx-auto mb-12">{settings.heroDescription}</p>
          )}
        </ScrollReveal>

        <ScrollReveal delay={320}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16">
            <Link
              to="/consultation"
              className="w-full sm:w-auto btn-terracotta text-base font-semibold px-10 py-5 rounded-2xl flex items-center justify-center gap-3 shadow-2xl text-lg"
            >
              <span>Book a Free Consultation</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}?text=Hello,%20I%20want%20to%20discuss%20my%20renovation.`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold border border-emerald-500 flex items-center justify-center gap-3 transition shadow-xl"
              >
                <MessageCircleMore className="w-5 h-5" />
                <span>Contact on WhatsApp</span>
              </a>
            )}
          </div>
        </ScrollReveal>

        {(trustBadges.length > 0 || reviewCount > 0) && (
          <ScrollReveal delay={420}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-stone-300 text-sm font-medium max-w-5xl mx-auto">
              {trustBadges.map((text, i) => {
                const Icon = BADGE_ICONS[i % BADGE_ICONS.length];
                return (
                  <div key={text} className="flex flex-col items-center space-y-2 p-5 md:p-6 glass-panel-dark rounded-2xl hover-lift">
                    <Icon className="w-7 h-7 text-[#C4795A]" />
                    <span className="text-center text-xs md:text-sm">{text}</span>
                  </div>
                );
              })}
              {reviewCount > 0 && avgRating > 0 && (
                <div className="flex flex-col items-center space-y-2 p-5 md:p-6 glass-panel-dark rounded-2xl hover-lift">
                  <Star className="w-7 h-7 text-[#C4795A]" />
                  <span className="text-center text-xs md:text-sm">{avgRating} Rating ({reviewCount}+ Reviews)</span>
                </div>
              )}
            </div>
          </ScrollReveal>
        )}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow text-stone-500">
        <div className="w-6 h-10 rounded-full border-2 border-stone-600 flex justify-center pt-2">
          <div className="w-1 h-2 bg-stone-500 rounded-full animate-scroll-dot" />
        </div>
      </div>
    </section>
  );
}
