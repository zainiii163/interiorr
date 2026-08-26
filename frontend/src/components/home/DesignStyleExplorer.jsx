import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '../ui/ScrollReveal';

export default function DesignStyleExplorer({ styles = [] }) {
  const [activeId, setActiveId] = useState(styles[0]?._id);

  useEffect(() => {
    if (!styles.length) return;
    if (!styles.some((s) => s._id === activeId)) {
      setActiveId(styles[0]._id);
    }
  }, [styles, activeId]);

  const active = styles.find((s) => s._id === activeId) || styles[0];

  if (!styles.length || !active) return null;

  return (
    <section className="py-24 bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-14">
          <span className="text-[#5C7A6B] font-semibold text-xs uppercase tracking-widest">
            Interior Design Styles
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 mt-2">
            Every Style Executed to Perfection
          </h2>
          <p className="text-stone-500 text-sm mt-3 max-w-2xl mx-auto">
            From contemporary to Arabian luxury — select a style to see how we interpret it for Dubai homes.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-stretch">
          <ScrollReveal>
            <div className="bg-white rounded-3xl border border-stone-200 p-4 h-full">
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-3 mb-2">
                Design Styles
              </p>
              <ul className="space-y-1">
                {styles.map((style) => {
                  const isActive = style._id === active._id;
                  return (
                    <li key={style._id}>
                      <button
                        type="button"
                        onClick={() => setActiveId(style._id)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                          isActive
                            ? 'bg-[#C4795A] text-white shadow-md'
                            : 'text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        {style.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <div className="relative rounded-3xl overflow-hidden min-h-[280px] sm:min-h-[360px] lg:min-h-[420px] bg-stone-900 text-white shadow-xl">
              {active.image && (
                <img
                  src={active.image}
                  alt={active.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-45"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-900/20" />
              <div className="relative z-10 h-full flex flex-col justify-end p-8 sm:p-12">
                <span className="text-[#C4795A] text-xs font-bold uppercase tracking-widest mb-2">
                  {active.tagline}
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold mb-4">{active.name}</h3>
                <p className="text-stone-200 text-sm leading-relaxed max-w-2xl mb-6">
                  {active.description}
                </p>
                {(active.characteristics || active.traits || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {(active.characteristics || active.traits).map((trait) => (
                      <span
                        key={trait}
                        className="text-[11px] uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 border border-white/15"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to={`/design-styles/${active.slug}`}
                    className="btn-terracotta inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
                  >
                    Explore {active.name} <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/design-styles"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-white/30 hover:bg-white/10 transition"
                  >
                    Explore All Design Styles
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
