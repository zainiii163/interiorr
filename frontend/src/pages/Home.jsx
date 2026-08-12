import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ChevronRight } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { apiFetch } from '../services/api';
import HeroSection from '../components/home/HeroSection';
import ExpertisePillars from '../components/home/ExpertisePillars';
import PromiseGrid from '../components/home/PromiseGrid';
import ProcessGrid from '../components/home/ProcessGrid';
import ProjectShowcase from '../components/home/ProjectShowcase';
import FeatureSplit from '../components/home/FeatureSplit';
import VideoShowcase from '../components/home/VideoShowcase';
import SkillsSection from '../components/home/SkillsSection';
import HomeConsultation from '../components/home/HomeConsultation';
import DesignStyleExplorer from '../components/home/DesignStyleExplorer';
import Marquee from '../components/ui/Marquee';
import ScrollReveal from '../components/ui/ScrollReveal';
import AnimatedCounter from '../components/ui/AnimatedCounter';

export default function Home() {
  const { settings } = useSite();
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [designStyles, setDesignStyles] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [partners, setPartners] = useState([]);
  const [expertisePillars, setExpertisePillars] = useState([]);
  const [promisePillars, setPromisePillars] = useState([]);
  const [processPillars, setProcessPillars] = useState([]);
  const [reviewMeta, setReviewMeta] = useState({ count: 0, averageRating: 0 });

  const stats = settings.statistics || {};

  useEffect(() => {
    const load = async () => {
      try {
        const [servRes, projRes, styleRes, revRes, partRes, expRes, promRes, procRes] = await Promise.all([
          apiFetch('/services'),
          apiFetch('/projects?limit=12'),
          apiFetch('/design-styles'),
          apiFetch('/reviews?featured=true'),
          apiFetch('/partners'),
          apiFetch('/trust-pillars?section=expertise'),
          apiFetch('/trust-pillars?section=promise'),
          apiFetch('/trust-pillars?section=process'),
        ]);

        if (servRes.success) setServices(servRes.data);
        if (projRes.success) setProjects(projRes.data);
        if (styleRes.success) setDesignStyles(styleRes.data);
        if (revRes.success) {
          setReviews(revRes.data.slice(0, 4));
          setReviewMeta({
            count: revRes.meta?.count ?? revRes.data.length,
            averageRating: revRes.meta?.averageRating ?? stats.customerRating,
          });
        }
        if (partRes.success) setPartners(partRes.data);
        if (expRes.success) setExpertisePillars(expRes.data);
        if (promRes.success) setPromisePillars(promRes.data);
        if (procRes.success) setProcessPillars(procRes.data);
      } catch (e) {
        console.error('Error loading home data:', e);
      }
    };
    load();
  }, [stats.customerRating]);

  const featured = projects.filter((p) => p.isFeatured !== false).slice(0, 9);
  const showcaseProjects = featured.length ? featured : projects.slice(0, 6);
  const avgRating = reviewMeta.averageRating || stats.customerRating;

  return (
    <div className="page-content">
      <HeroSection settings={settings} />

      {partners.length > 0 && (
        <section className="py-10 bg-stone-900 border-y border-stone-800">
          <ScrollReveal className="text-center mb-2 px-4">
            <span className="text-stone-500 text-xs uppercase tracking-widest font-semibold">
              Our Trusted Partners
            </span>
            <p className="text-stone-600 text-[11px] mt-1">
              Property owners, interior designers, consultants & contractors
            </p>
          </ScrollReveal>
          <Marquee items={partners} speed={28} />
        </section>
      )}

      <ExpertisePillars pillars={expertisePillars} />

      <ProjectShowcase projects={showcaseProjects} />

      {(stats.yearsExperience > 0 || stats.completedProjects > 0) && (
        <section className="py-20 bg-gradient-to-r from-[#1A1817] to-[#2D2A28] text-white border-y border-stone-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="text-center mb-12">
              <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">About Us</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2">
                Dubai&apos;s Most Trusted Fitout & Property Transformation Specialists
              </h2>
              <p className="text-stone-400 mt-3 max-w-2xl mx-auto text-sm">
                Full turnkey execution with certified engineers, in-house joinery, and transparent delivery for homes and commercial spaces.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-[#C4795A] font-semibold text-sm mt-4 hover:underline"
              >
                Learn more about us <ChevronRight className="w-4 h-4" />
              </Link>
            </ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
              {[
                { val: stats.yearsExperience, suffix: '+', label: 'Years Experience' },
                { val: stats.completedProjects, suffix: '+', label: 'Projects Delivered' },
                { val: stats.teamMembers, suffix: '+', label: 'Skilled Team' },
                { val: stats.propertyInspections, suffix: '+', label: 'Inspections' },
                { val: stats.customerRating, suffix: '', label: 'Google Rating', decimals: 1 },
              ]
                .filter((s) => s.val !== undefined && s.val !== null && s.val !== '')
                .map((s, i) => (
                  <ScrollReveal key={s.label} delay={i * 80}>
                    <div className="p-6 glass-panel-dark rounded-2xl hover-lift">
                      <div className="font-serif text-4xl md:text-5xl font-bold text-[#C4795A]">
                        <AnimatedCounter value={s.val} suffix={s.suffix} decimals={s.decimals || 0} />
                      </div>
                      <div className="text-xs uppercase tracking-wider text-stone-400 mt-2 font-medium">{s.label}</div>
                    </div>
                  </ScrollReveal>
                ))}
            </div>
          </div>
        </section>
      )}

      <FeatureSplit services={services} />

      <PromiseGrid pillars={promisePillars} />

      <HomeConsultation />

      {services.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                  <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">Complete Range</span>
                  <h2 className="font-serif text-4xl font-bold text-stone-900 mt-2">Our Complete Range of Services</h2>
                  <p className="text-stone-500 text-sm mt-2 max-w-xl">
                    From concept to completion — design, fit-out, joinery, and property services under one roof.
                  </p>
                </div>
                <Link to="/services" className="text-[#5C7A6B] font-semibold flex items-center gap-2 hover:gap-3 transition-all shrink-0">
                  All Services <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {services.map((service, i) => (
                <ScrollReveal key={service._id} delay={(i % 4) * 40}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="service-tile block p-5 rounded-2xl border border-stone-200 bg-stone-50 text-center group hover:border-[#C4795A]/40 hover:bg-white transition"
                  >
                    <h3 className="font-serif font-bold text-stone-900 text-sm group-hover:text-[#C4795A] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-[10px] text-stone-500 mt-1 uppercase tracking-wider">{service.category}</p>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="py-24 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="text-center mb-14">
              <div className="flex justify-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <h2 className="font-serif text-4xl font-bold text-stone-900">What Our Clients Say</h2>
              {avgRating > 0 && (
                <p className="text-stone-600 mt-2">
                  {avgRating} average from Google reviews
                </p>
              )}
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev, i) => (
                <ScrollReveal key={rev._id} delay={i * 100}>
                  <div className="p-8 rounded-3xl bg-white border border-stone-200 hover-lift h-full flex flex-col">
                    <div className="flex gap-1 text-amber-400 mb-4">
                      {[...Array(rev.rating)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-stone-700 leading-relaxed italic flex-1">&ldquo;{rev.reviewText}&rdquo;</p>
                    <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between">
                      <div>
                        <span className="font-serif font-bold text-stone-900">{rev.customerName}</span>
                        <span className="block text-xs text-stone-500">{rev.authorTitle || 'Client'}</span>
                      </div>
                      {rev.source && (
                        <span className="text-[10px] font-bold uppercase text-stone-400 bg-stone-100 px-2 py-1 rounded">
                          {rev.source}
                        </span>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal className="text-center mt-10">
              <Link to="/reviews" className="text-[#C4795A] font-semibold hover:underline">
                Read all reviews →
              </Link>
            </ScrollReveal>
          </div>
        </section>
      )}

      <VideoShowcase />

      <DesignStyleExplorer styles={designStyles} />

      <SkillsSection settings={settings} />

      <ProcessGrid pillars={processPillars} />

      <section className="py-20 bg-gradient-to-r from-[#1A1817] to-[#2D2A28] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center">
            <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">
              Experience Center
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold mt-2 mb-4">
              Material Selection Made Simple
            </h2>
            <p className="text-stone-400 max-w-2xl mx-auto mb-8">
              Visit our curated catalog of kitchens, wardrobes, tiles, sanitaryware, flooring, and marble — the same experience-center approach Dubai renovators trust.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/materials"
                className="btn-terracotta inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm"
              >
                Browse Materials <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/commercial"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm border border-stone-600 text-stone-200 hover:bg-white/10 transition"
              >
                Commercial Fit-Out
              </Link>
              <Link
                to="/careers"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm border border-stone-600 text-stone-200 hover:bg-white/10 transition"
              >
                Join Our Team
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative py-28 overflow-hidden">
        {settings.ctaBandImage && (
          <img
            src={settings.ctaBandImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover ken-burns opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-stone-900/85" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <ScrollReveal>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
              {settings.finalCtaTitle || settings.ctaBandTitle || 'Ready to Transform Your Property?'}
            </h2>
            <p className="text-stone-300 text-lg mb-8 max-w-2xl mx-auto">
              {settings.finalCtaBody ||
                settings.ctaBandBody ||
                'Book a free site visit and get a detailed consultation with transparent pricing for your fit-out or renovation.'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/consultation" className="btn-terracotta px-10 py-4 rounded-2xl font-semibold">
                Book Free Consultation
              </Link>
              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/\+/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-10 py-4 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 font-semibold backdrop-blur-sm transition"
                >
                  WhatsApp Now
                </a>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
