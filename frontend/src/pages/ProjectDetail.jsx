import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { apiFetch } from '../services/api';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sliderPos, setSliderPos] = useState(50);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await apiFetch(`/projects/${slug}`);
        if (res.success) setProject(res.data);
      } catch (e) {
        console.error('Error fetching project:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) {
    return <div className="pt-32 text-center py-20 font-serif text-xl">Loading Project Details...</div>;
  }

  if (!project) {
    return (
      <div className="pt-32 text-center py-20">
        <h2 className="text-2xl font-serif font-bold">Project Not Found</h2>
        <Link to="/projects" className="mt-4 inline-block text-[#C4795A] font-semibold">
          Return to Projects Portfolio
        </Link>
      </div>
    );
  }

  const hasBeforeAfter = project.beforeImages?.length > 0 && project.afterImages?.length > 0;

  return (
    <div className="page-offset pb-20">
      
      {/* Header */}
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">
            {project.category} • {project.location}
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold mt-2">{project.title}</h1>
          <div className="mt-4 flex flex-wrap gap-6 text-sm text-stone-300">
            <div><span className="text-stone-500 uppercase tracking-wider text-[11px] block">Location</span> {project.location}</div>
            <div><span className="text-stone-500 uppercase tracking-wider text-[11px] block">Scope</span> {project.scope}</div>
            <div><span className="text-stone-500 uppercase tracking-wider text-[11px] block">Duration</span> {project.duration}</div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Cover Image */}
        <div className="rounded-2xl overflow-hidden shadow-2xl max-h-[600px]">
          <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
        </div>

        {/* FR-033: Before & After Comparison Slider */}
        {hasBeforeAfter && (
          <div className="bg-stone-900 text-white p-8 rounded-2xl space-y-6">
            <h2 className="font-serif text-3xl font-bold text-[#C4795A] text-center">Before & After Transformation</h2>
            <div className="relative w-full max-w-4xl mx-auto h-[450px] rounded-2xl overflow-hidden shadow-2xl select-none">
              
              {/* After Image (Full width background) */}
              <img
                src={project.afterImages[0]}
                alt="After Renovation"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute top-4 right-4 bg-emerald-600/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-20">
                AFTER
              </span>

              {/* Before Image (Clipped overlay) */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden z-10"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={project.beforeImages[0]}
                  alt="Before Renovation"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: '100%', height: '100%' }}
                />
                <span className="absolute top-4 left-4 bg-stone-900/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-20">
                  BEFORE
                </span>
              </div>

              {/* Range Input Slider Controls */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              />
              <div
                className="absolute inset-y-0 w-1 bg-white z-20 shadow-2xl pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-stone-900 flex items-center justify-center font-bold text-xs shadow-xl">
                  ↔
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-stone-400">Drag the slider horizontally to compare before and after.</p>
          </div>
        )}

        {/* Project Description */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <h2 className="font-serif text-3xl font-bold text-stone-900">Project Overview</h2>
          <p className="text-stone-700 leading-relaxed text-base">{project.description}</p>
        </div>

        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <div>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mb-8">Photo Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.gallery.map((img, idx) => (
                <div key={idx} className="rounded-2xl overflow-hidden shadow-md h-72">
                  <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Consultation CTA */}
        <div className="bg-[#1A1817] text-white p-12 rounded-2xl text-center space-y-6">
          <h2 className="font-serif text-3xl font-bold">Envisioning a Similar Transformation?</h2>
          <p className="text-stone-300 text-sm max-w-2xl mx-auto">
            Book a complimentary architectural review with our senior interior project team.
          </p>
          <Link
            to="/book-consultation"
            className="btn-terracotta inline-block px-8 py-3.5 rounded-xl font-semibold text-sm shadow-xl"
          >
            Start Your Renovation Journey
          </Link>
        </div>

      </section>

    </div>
  );
}
