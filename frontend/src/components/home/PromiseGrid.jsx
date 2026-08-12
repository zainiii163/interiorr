import { getPillarIcon } from '../../utils/pillarIcons';
import ScrollReveal from '../ui/ScrollReveal';

export default function PromiseGrid({ pillars = [] }) {
  if (!pillars.length) return null;

  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-14">
          <span className="text-[#5C7A6B] font-semibold text-xs uppercase tracking-widest">Our Promise</span>
          <h2 className="font-serif text-4xl font-bold text-stone-900 mt-2">Why Property Owners Choose Us</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = getPillarIcon(pillar.icon);
            return (
              <ScrollReveal key={pillar._id || pillar.title} delay={i * 80}>
                <div className="h-full p-8 bg-white rounded-3xl border border-stone-200 shadow-sm hover-lift hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-[#C4795A]/10 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-[#C4795A]" />
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
