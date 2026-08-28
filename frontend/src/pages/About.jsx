import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function About() {
  const { settings } = useSite();
  const stats = settings.statistics || {};
  const company = settings.companyName || 'Hulul Al Madina Interiors';
  const subtitle = settings.aboutSubtitle || 'Heritage & Excellence';
  const title = settings.aboutTitle || `About ${company}`;
  const body =
    settings.aboutBody ||
    'Dubai\'s leading interior fit-out, bespoke joinery, and architectural contracting firm.';
  const whoTitle =
    settings.aboutTitle ||
    'Transforming Residences into Architectural Masterpieces';
  const bullets =
    settings.aboutBullets?.length > 0
      ? settings.aboutBullets
      : [
          'In-House Cabinetry & Millwork Workshop in Dubai',
          'Dedicated Project Managers & Thermal Snagging Engineers',
          'Full Transparency with Detailed BOQ & Fixed Timeline Guarantee',
        ];
  const aboutImage =
    settings.aboutImage ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80';
  const mission =
    settings.mission ||
    'To deliver world-class turnkey interior fit-outs with uncompromising craftsmanship, transparent communication, and flawless Dubai authority approvals.';
  const vision =
    settings.vision ||
    'To remain the most trusted interior renovation and joinery brand across the United Arab Emirates, setting new benchmarks in sustainable luxury design.';
  const skills = settings.skills || [];

  const statCards = [
    { label: 'Years Experience', value: stats.yearsExperience },
    { label: 'Projects Completed', value: stats.completedProjects },
    { label: 'Team Members', value: stats.teamMembers },
    { label: 'Inspections', value: stats.propertyInspections },
    { label: 'Customer Rating', value: stats.customerRating },
  ].filter((s) => s.value !== undefined && s.value !== null && s.value !== '');

  return (
    <div className="page-offset pb-20">
      <section className="bg-stone-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">
            {subtitle}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mt-2 break-words">{title}</h1>
          <p className="text-stone-300 mt-4 max-w-2xl mx-auto text-base">{body}</p>
        </div>
      </section>

      {statCards.length > 0 && (
        <section className="bg-[#C4795A] text-white py-10">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 text-center">
            {statCards.map((s) => (
              <div key={s.label}>
                <div className="font-serif text-3xl font-bold">
                  {s.label === 'Customer Rating' ? s.value : `${s.value}+`}
                </div>
                <div className="text-[10px] uppercase tracking-widest mt-1 opacity-90">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#5C7A6B] font-semibold text-xs uppercase tracking-widest">Who We Are</span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mt-2">{whoTitle}</h2>
            <p className="text-stone-600 mt-4 leading-relaxed text-sm">{body}</p>
            <div className="mt-8 space-y-3">
              {bullets.map((bullet) => (
                <div key={bullet} className="flex items-center space-x-3 text-stone-800 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#C4795A] shrink-0" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <img
              src={aboutImage}
              alt={company}
              className="rounded-2xl shadow-2xl object-cover h-[240px] sm:h-[360px] lg:h-[450px] w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
          <div className="p-8 rounded-2xl bg-white border border-stone-200 shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-3">Our Mission</h3>
            <p className="text-stone-600 text-sm leading-relaxed">{mission}</p>
          </div>
          <div className="p-8 rounded-2xl bg-white border border-stone-200 shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-3">Our Vision</h3>
            <p className="text-stone-600 text-sm leading-relaxed">{vision}</p>
          </div>
        </div>

        {(settings.certifications || []).length > 0 && (
          <div className="mt-20">
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">Licenses & Certifications</h3>
            <p className="text-stone-600 text-sm mb-6 max-w-2xl">
              Authority-ready delivery for Dubai residences and commercial spaces.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {settings.certifications.map((cert) => (
                <div
                  key={cert}
                  className="flex items-center gap-3 p-4 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-800"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#5C7A6B] shrink-0" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div className="mt-20">
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-6">
              {settings.skillsTitle || 'Our Expertise'}
            </h3>
            {settings.skillsBody && (
              <p className="text-stone-600 text-sm mb-8 max-w-2xl">{settings.skillsBody}</p>
            )}
            <div className="space-y-4 max-w-2xl">
              {skills.map((skill) => (
                <div key={skill.label}>
                  <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                    <span>{skill.label}</span>
                    <span>{skill.value}%</span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C4795A] rounded-full"
                      style={{ width: `${Math.min(100, Number(skill.value) || 0)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
