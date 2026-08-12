import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ScrollReveal from '../ui/ScrollReveal';

const FILTERS = ['All', 'Residential', 'Commercial', 'Retail'];

export default function ProjectShowcase({ projects = [] }) {
  const [active, setActive] = useState('All');

  const filtered = useMemo(() => {
    if (active === 'All') return projects;
    return projects.filter((p) => p.category?.toLowerCase() === active.toLowerCase());
  }, [projects, active]);

  if (!projects.length) return null;

  return (
    <section className="py-0 bg-stone-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">Portfolio</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-100 mt-2">
                Featured Fitout Makeovers
              </h2>
              <p className="text-stone-400 text-sm mt-3 max-w-xl">
                Residential, commercial, and retail transformations delivered turnkey across Dubai.
              </p>
            </div>
            <Link to="/projects" className="text-[#C4795A] font-semibold flex items-center gap-2 hover:gap-3 transition-all shrink-0">
              View All Projects <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <div className="flex flex-wrap gap-2 mb-10">
            {FILTERS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActive(tab)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  active === tab
                    ? 'bg-[#C4795A] text-white shadow-lg'
                    : 'bg-white/10 text-stone-400 hover:bg-white/20 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </ScrollReveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-stone-800">
        {filtered.map((project, i) => (
          <ScrollReveal key={project._id} delay={(i % 3) * 70}>
            <Link
              to={`/projects/${project.slug}`}
              className="group relative overflow-hidden bg-stone-900 flex flex-col h-[440px] block border-b border-r border-stone-800"
            >
              {project.coverImage && (
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/45 to-transparent" />
              <div className="relative mt-auto p-8">
                <span className="text-xs font-bold text-[#C4795A] uppercase tracking-wider mb-1 block">
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
        <p className="text-center text-stone-500 py-16 px-4">No projects in this category yet.</p>
      )}
    </section>
  );
}
