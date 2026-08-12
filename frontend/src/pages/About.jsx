import React from 'react';
import { ShieldCheck, Award, Building, CheckCircle2, Users, FileCheck } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function About() {
  const { settings } = useSite();
  const stats = settings.statistics || { yearsExperience: 14, completedProjects: 350, teamMembers: 45, propertyInspections: 820 };

  return (
    <div className="page-offset pb-20">
      
      {/* Header */}
      <section className="bg-stone-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">Heritage & Excellence</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold mt-2">About Aura Interiors Dubai</h1>
          <p className="text-stone-300 mt-4 max-w-2xl mx-auto text-base">
            Dubai's leading interior fit-out, bespoke joinery, and architectural contracting firm.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#5C7A6B] font-semibold text-xs uppercase tracking-widest">Who We Are</span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mt-2">
              Transforming Residences into Architectural Masterpieces Since 2012
            </h2>
            <p className="text-stone-600 mt-4 leading-relaxed text-sm">
              Founded in Dubai, Aura Luxury Interiors provides full end-to-end renovation services encompassing interior architecture, custom joinery fabrication in our private Dubai workshop, MEP engineering, and official authority permits (DDA, Dubai Municipality, Concordia, Nakheel).
            </p>
            <div className="mt-8 space-y-3">
              <div className="flex items-center space-x-3 text-stone-800 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-[#C4795A]" />
                <span>In-House Cabinetry & Millwork Workshop in Dubai</span>
              </div>
              <div className="flex items-center space-x-3 text-stone-800 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-[#C4795A]" />
                <span>Dedicated Project Managers & Thermal Snagging Engineers</span>
              </div>
              <div className="flex items-center space-x-3 text-stone-800 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-[#C4795A]" />
                <span>Full Transparency with Detailed BOQ & Fixed Timeline Guarantee</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
              alt="Dubai Renovation Team"
              className="rounded-2xl shadow-2xl object-cover h-[450px] w-full"
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
          <div className="p-8 rounded-2xl bg-white border border-stone-200 shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-3">Our Mission</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              To deliver world-class turnkey interior fit-outs with uncompromising craftsmanship, transparent communication, and flawless Dubai authority approvals.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-white border border-stone-200 shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-3">Our Vision</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              To remain the most trusted interior renovation and joinery brand across the United Arab Emirates, setting new benchmarks in sustainable luxury design.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
