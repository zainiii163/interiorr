import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useSite } from '../context/SiteContext';
import { usePageCopy } from '../utils/pageCopy';
import SkeletonGrid from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

export default function Projects() {
  const { settings } = useSite();
  const copy = usePageCopy(settings);
  const [allProjects, setAllProjects] = useState([]);
  const [category, setCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiFetch('/projects').then((res) => {
      if (res.success) setAllProjects(res.data);
    }).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  const categories = ['All', ...new Set(allProjects.map((p) => p.category).filter(Boolean))];

  const projects = category === 'All'
    ? allProjects
    : allProjects.filter((p) => p.category?.toLowerCase() === category.toLowerCase());

  return (
    <div className="page-offset pb-20">
      <section className="bg-gradient-to-r from-stone-900 to-[#1A1817] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-[#C4795A] font-semibold text-sm uppercase tracking-widest">
            {copy.projectsHeroBadge || 'Our Work'}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-4">
            {copy.projectsHeroTitle}
          </h1>
          {copy.projectsHeroBody && (
            <p className="text-stone-300 mt-4 max-w-2xl mx-auto text-sm">{copy.projectsHeroBody}</p>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                  category === cat ? 'bg-[#C4795A] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <SkeletonGrid count={6} cols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" gap="gap-8" />
        ) : projects.length === 0 ? (
          <EmptyState
            icon="empty"
            title="No projects published yet"
            description="Check back soon for our latest completed work."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link
                key={project._id}
                to={`/projects/${project.slug}`}
                className="group bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover-lift flex flex-col"
              >
                {project.coverImage && (
                  <div className="h-64 overflow-hidden">
                    <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-xs font-bold text-[#C4795A] uppercase">{project.category}</span>
                  <h3 className="font-serif text-xl font-bold text-stone-900 mt-1 group-hover:text-[#C4795A] transition-colors">{project.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-stone-500 mt-3">
                    {project.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{project.location}</span>}
                    {project.duration && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{project.duration}</span>}
                  </div>
                  <p className="text-stone-600 text-sm mt-3 line-clamp-2 flex-1">{project.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#C4795A] mt-4">
                    View Project <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
