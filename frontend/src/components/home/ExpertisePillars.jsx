import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { getPillarIcon } from '../../utils/pillarIcons';
import ScrollReveal from '../ui/ScrollReveal';

function highlightsFor(pillar) {
  if (Array.isArray(pillar.highlights) && pillar.highlights.length) return pillar.highlights;
  if (pillar.description?.includes('•')) {
    return pillar.description.split('•').map((s) => s.trim()).filter(Boolean);
  }
  return pillar.description ? [pillar.description] : [];
}

export default function ExpertisePillars({ pillars = [], copy = {} }) {
  const [activeId, setActiveId] = useState(pillars[0]?._id);

  useEffect(() => {
    if (!pillars.length) return;
    if (!pillars.some((p) => p._id === activeId)) {
      setActiveId(pillars[0]._id);
    }
  }, [pillars, activeId]);

  const active = pillars.find((p) => p._id === activeId) || pillars[0];

  if (!pillars.length) return null;

  const bullets = active ? highlightsFor(active) : [];

  return (
    <section className="py-20 bg-white border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-14">
          <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">
            {copy.homeExpertiseBadge || 'Technical Services'}
          </span>
          <h2 className="font-serif text-4xl font-bold text-stone-900 mt-2">
            {copy.homeExpertiseTitle || 'Maintenance & Renovation Under One Roof'}
          </h2>
          <p className="text-stone-500 text-sm mt-3 max-w-2xl mx-auto">
            {copy.homeExpertiseBody}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {pillars.map((pillar, i) => {
            const Icon = getPillarIcon(pillar.icon);
            const isActive = active && pillar._id === active._id;
            return (
              <ScrollReveal key={pillar._id || pillar.title} delay={i * 80}>
                <button
                  type="button"
                  onClick={() => setActiveId(pillar._id)}
                  className={`w-full text-left h-full p-8 rounded-3xl border transition-all duration-300 ${
                    isActive
                      ? 'bg-stone-900 text-white border-stone-800 shadow-xl'
                      : 'bg-gradient-to-br from-stone-50 to-white border-stone-200 hover-lift'
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                      isActive ? 'bg-white/10' : 'bg-white shadow-md'
                    }`}
                  >
                    <Icon className="w-7 h-7 text-[#C4795A]" />
                  </div>
                  <h3 className={`font-serif text-xl font-bold mb-3 ${isActive ? 'text-white' : 'text-stone-900'}`}>
                    {pillar.title}
                  </h3>
                  <p className={`text-sm leading-relaxed line-clamp-3 ${isActive ? 'text-stone-300' : 'text-stone-600'}`}>
                    {pillar.description}
                  </p>
                </button>
              </ScrollReveal>
            );
          })}
        </div>

        {active && bullets.length > 0 && (
          <div className="rounded-3xl bg-stone-50 border border-stone-200 p-8 sm:p-10">
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-6">{active.title}</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bullets.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-stone-700">
                  <CheckCircle2 className="w-5 h-5 text-[#C4795A] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
