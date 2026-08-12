import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ScrollReveal from '../ui/ScrollReveal';

export default function ProjectShowcase({ projects = [] }) {
  const categories = useMemo(() => {
    const unique = [...new Set(projects.map((p) => p.category).filter(Boolean))];
    return ['All', ...unique];
  }, [projects]);

  const [active, setActive] = useState('All');

  const filtered =
    active === 'All' ? projects : projects.filter((p) => p.category?.toLowerCase() === active.toLowerCase());

  if (!projects.length) return null;

  return (
    <section className="py-24 bg-gradient-to-b from-stone-900 to-[#1A1817] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">Portfolio</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-100 mt-2">
                Featured Fitout Makeovers
              </h2>
            </div>
            <Link to="/projects" className="text-[#C4795A] font-semibold flex items-center gap-2 hover:gap-3 transition-all">
              View All Projects <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </ScrollReveal>

        {categories.length > 1 && (
          <ScrollReveal delay={100}>
            <div className="flex flex-wrap gap-2 mb-12">
              {categories.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActive(tab)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    active === tab
                      ? 'bg-[#C4795A] text-white shadow-lg scale-105'
                      : 'bg-white/10 text-stone-400 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </ScrollReveal>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <ScrollReveal key={project._id} delay={i * 80}>
              <Link
                to={`/projects/${project.slug}`}
                className="group relative rounded-3xl overflow-hidden bg-stone-800 shadow-2xl flex flex-col h-[420px] hover-lift block"
              >
                {project.coverImage && (
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent p-8 flex flex-col justify-end">
                  <span className="text-xs font-bold text-[#C4795A] uppercase tracking-wider mb-1">
                    {project.location} • {project.category}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white group-hover:text-[#C4795A] transition-colors">
                    {project.title}
                  </h3>
                  {project.scope && <p className="text-sm text-stone-300 mt-2 line-clamp-2">{project.scope}</p>}
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-stone-500 py-12">No projects in this category yet.</p>
        )}
      </div>
    </section>
  );
}
