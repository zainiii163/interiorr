import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardCheck, Wind } from 'lucide-react';
import ScrollReveal from '../ui/ScrollReveal';

const PANEL_META = [
  {
    key: 'inspection',
    icon: ClipboardCheck,
    matchers: ['inspection', 'snagging', 'snag'],
    cta: 'Book an Inspection',
    slug: 'property-inspection',
    tone: 'dark',
  },
  {
    key: 'air',
    icon: Wind,
    matchers: ['air quality', 'air-quality', 'shield', 'halo shield'],
    cta: 'Explore Air Quality',
    slug: 'air-quality',
    tone: 'light',
  },
];

function pickService(services, matchers) {
  return services.find((s) => {
    const hay = `${s.slug || ''} ${s.name || ''} ${s.title || ''} ${s.category || ''}`.toLowerCase();
    return matchers.some((m) => hay.includes(m));
  });
}

export default function FeatureSplit({ services = [] }) {
  const panels = PANEL_META.map((meta) => {
    const service = pickService(services, meta.matchers);
    if (!service) return null;
    return {
      ...meta,
      title: service.name || service.title,
      description: service.shortDescription || service.description,
      image: service.heroImage || service.image,
      slug: service.slug || meta.slug,
    };
  }).filter(Boolean);

  if (!panels.length) return null;

  return (
    <section className="bg-stone-100">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {panels.map((panel, index) => {
          const Icon = panel.icon;
          const isDark = index === 0;
          return (
            <ScrollReveal key={panel.key} delay={index * 100}>
              <div className={`relative min-h-[320px] sm:min-h-[400px] lg:min-h-[480px] flex flex-col justify-end overflow-hidden ${isDark ? 'bg-stone-900 text-white' : 'bg-white text-stone-900'}`}>
                {panel.image ? (
                  <img
                    src={panel.image}
                    alt={panel.title}
                    className={`absolute inset-0 w-full h-full object-cover ${isDark ? 'opacity-35' : 'opacity-25'}`}
                  />
                ) : (
                  <div className={`absolute inset-0 ${isDark ? 'bg-stone-900' : 'bg-stone-100'}`} />
                )}
                <div
                  className={`absolute inset-0 ${
                    isDark
                      ? 'bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-900/40'
                      : 'bg-gradient-to-t from-white via-white/90 to-white/50'
                  }`}
                />
                <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-xl">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                      isDark ? 'bg-[#C4795A]/20 text-[#C4795A]' : 'bg-[#5C7A6B]/15 text-[#5C7A6B]'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">{panel.title}</h2>
                  <p className={`text-sm leading-relaxed mb-8 ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                    {panel.description}
                  </p>
                  <Link
                    to={`/services/${panel.slug}`}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition ${
                      isDark
                        ? 'btn-terracotta'
                        : 'bg-[#5C7A6B] hover:bg-[#4a6558] text-white'
                    }`}
                  >
                    {panel.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
