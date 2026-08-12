import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../services/api';
import ScrollReveal from '../components/ui/ScrollReveal';

const SPACE_TYPES = [
  { title: 'Offices & Co-working', body: 'Brand-aligned workspaces with partitions, joinery, lighting, and MEP.' },
  { title: 'Clinics & Wellness', body: 'Authority-ready clinical fit-outs with hygiene finishes and HVAC coordination.' },
  { title: 'Retail & Showrooms', body: 'Customer-facing interiors with custom displays and decorative finishes.' },
  { title: 'Gyms, Salons & F&B', body: 'High-performance commercial spaces built for operations and brand experience.' },
];

const FAQS = [
  {
    q: 'How long does a commercial fit-out take in Dubai?',
    a: 'A typical office of 2,000–5,000 sq ft takes 4–8 weeks. Clinics, gyms, and retail may take 6–12 weeks depending on technical scope and approvals.',
  },
  {
    q: 'What is included in a turnkey commercial package?',
    a: 'Design, approvals, partitions, ceilings, flooring, MEP, joinery, painting, and finishing — from concept to handover under one contract.',
  },
  {
    q: 'Do you handle NOCs and authority approvals?',
    a: 'Yes. An in-house team manages community, building management, and authority approvals so your programme is not delayed by paperwork.',
  },
];

export default function Commercial() {
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    Promise.all([apiFetch('/projects'), apiFetch('/services')])
      .then(([projRes, servRes]) => {
        if (projRes.success) {
          setProjects(
            projRes.data.filter((p) =>
              ['commercial', 'retail'].includes(String(p.category || '').toLowerCase())
            )
          );
        }
        if (servRes.success) {
          setServices(
            servRes.data.filter((s) =>
              ['fitout', 'joinery', 'specialty'].includes(String(s.category || '').toLowerCase())
            ).slice(0, 8)
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="page-offset pb-20">
      <section className="relative min-h-[70vh] flex items-end bg-stone-900 text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-900/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">
            Commercial Fit-Out Dubai
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold mt-3 max-w-4xl leading-tight">
            High-Performance Commercial Spaces for Businesses in Dubai
          </h1>
          <p className="text-stone-300 mt-4 max-w-2xl">
            Offices, clinics, gyms, and retail — rapid execution, technical accuracy, and a premium finish.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link to="/consultation?service=Turnkey%20Contracting" className="btn-terracotta px-8 py-4 rounded-2xl font-semibold inline-flex items-center justify-center gap-2">
              Book a Commercial Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/projects" className="px-8 py-4 rounded-2xl font-semibold border border-white/30 hover:bg-white/10 text-center">
              View Commercial Projects
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">Spaces We Fit Out</h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPACE_TYPES.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 80}>
              <div className="p-6 rounded-2xl border border-stone-200 bg-white h-full">
                <Building2 className="w-6 h-6 text-[#C4795A] mb-4" />
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">{item.title}</h3>
                <p className="text-sm text-stone-600">{item.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {projects.length > 0 && (
        <section className="py-16 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <h2 className="font-serif text-3xl font-bold text-stone-900">Commercial Portfolio</h2>
              <Link to="/projects" className="text-[#C4795A] font-semibold text-sm">View all →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project.slug}`}
                  className="group rounded-2xl overflow-hidden bg-white border border-stone-200 hover-lift"
                >
                  {project.coverImage && (
                    <div className="h-52 overflow-hidden">
                      <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                  )}
                  <div className="p-5">
                    <span className="text-[10px] uppercase tracking-wider text-[#C4795A] font-bold">{project.category}</span>
                    <h3 className="font-serif text-lg font-bold text-stone-900 mt-1">{project.title}</h3>
                    <p className="text-xs text-stone-500 mt-1">{project.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {services.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-stone-900 mb-8">Related Capabilities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {services.map((s) => (
              <Link
                key={s._id}
                to={`/services/${s.slug}`}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50 text-center hover:border-[#C4795A]/40 hover:bg-white transition"
              >
                <span className="font-serif font-bold text-sm text-stone-900">{s.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="py-16 bg-stone-900 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold mb-8 text-center">Commercial Fit-Out FAQs</h2>
          <div className="space-y-4">
            {FAQS.map((item) => (
              <div key={item.q} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-2">{item.q}</h3>
                <p className="text-sm text-stone-300 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-center px-4">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
          Start Your Commercial Transformation
        </h2>
        <p className="text-stone-600 max-w-xl mx-auto mb-8">
          Our team will contact you within 24 hours to schedule a free consultation and site visit.
        </p>
        <Link to="/consultation" className="btn-terracotta inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold">
          <CheckCircle2 className="w-5 h-5" /> Book Free Consultation
        </Link>
      </section>
    </div>
  );
}
