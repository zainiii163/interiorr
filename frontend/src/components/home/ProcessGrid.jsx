import { getPillarIcon } from '../../utils/pillarIcons';
import ScrollReveal from '../ui/ScrollReveal';

const FALLBACK = [
  {
    title: 'Standard Pricing',
    description: 'Quotations are itemized with standard pricing — clear scope, no hidden costs.',
    icon: 'Receipt',
  },
  {
    title: 'Material Selection',
    description: 'Visit the experience center for kitchens, wardrobes, tiles, sanitaryware, and flooring.',
    icon: 'Package',
  },
  {
    title: "NOCs & Authority Approvals",
    description: 'In-house team for community, building management, and municipality approvals.',
    icon: 'FileCheck2',
  },
  {
    title: 'Build With the Best',
    description: 'Licensed technicians and engineers execute and update throughout the project.',
    icon: 'HardHat',
  },
  {
    title: 'Free Designs',
    description: 'Basic 2D and 3D drawings included for confirmed projects. Premium design available.',
    icon: 'Palette',
  },
  {
    title: 'Warranty',
    description: 'Up to 10 years on kitchens, wardrobes and cabinets. 1-year workmanship warranty.',
    icon: 'ShieldCheck',
  },
];

export default function ProcessGrid({ pillars = [] }) {
  const items = pillars.length ? pillars : FALLBACK;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-14">
          <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">
            A Name You Can Trust
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 mt-2">
            How We Deliver Every Project
          </h2>
          <p className="text-stone-500 text-sm mt-3 max-w-2xl mx-auto">
            Standard pricing, material selection, authority approvals, licensed execution, free basic
            design, and warranty — the same delivery model Dubai renovators rely on.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((pillar, i) => {
            const Icon = getPillarIcon(pillar.icon);
            return (
              <ScrollReveal key={pillar._id || pillar.title} delay={i * 70}>
                <div className="h-full p-8 rounded-3xl border border-stone-200 bg-stone-50 hover:bg-white hover:shadow-lg hover:border-[#C4795A]/30 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-serif text-3xl font-bold text-[#C4795A]/40">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="w-11 h-11 rounded-xl bg-white border border-stone-200 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#5C7A6B]" />
                    </div>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">{pillar.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{pillar.description}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
