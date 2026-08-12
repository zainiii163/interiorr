import { getPillarIcon } from '../../utils/pillarIcons';
import ScrollReveal from '../ui/ScrollReveal';

export default function ExpertisePillars({ pillars = [] }) {
  if (!pillars.length) return null;

  return (
    <section className="py-20 bg-white border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-14">
          <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">What We Do</span>
          <h2 className="font-serif text-4xl font-bold text-stone-900 mt-2">Complete Property Transformation</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = getPillarIcon(pillar.icon);
            return (
              <ScrollReveal key={pillar._id || pillar.title} delay={i * 100}>
                <div className="h-full p-8 rounded-3xl bg-gradient-to-br from-stone-50 to-white border border-stone-200 hover-lift group">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-[#C4795A]" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-stone-900 mb-3">{pillar.title}</h3>
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
