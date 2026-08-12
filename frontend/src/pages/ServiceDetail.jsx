import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, PhoneCall, ShieldCheck } from 'lucide-react';
import { apiFetch } from '../services/api';

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await apiFetch(`/services/${slug}`);
        if (res.success) setService(res.data);
      } catch (e) {
        console.error('Error fetching service:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [slug]);

  if (loading) {
    return <div className="pt-32 text-center py-20 font-serif text-xl">Loading Service Details...</div>;
  }

  if (!service) {
    return (
      <div className="pt-32 text-center py-20">
        <h2 className="text-2xl font-serif font-bold">Service Not Found</h2>
        <Link to="/services" className="mt-4 inline-block text-[#C4795A] font-semibold">
          Return to Services Listing
        </Link>
      </div>
    );
  }

  return (
    <div className="page-offset pb-20">
      
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center bg-stone-900 text-white overflow-hidden">
        <img
          src={service.heroImage}
          alt={service.name}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest bg-stone-900/80 px-4 py-1.5 rounded-full border border-stone-700">
            {service.category}
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold mt-4">{service.name}</h1>
          <p className="text-stone-300 mt-4 max-w-2xl mx-auto text-base">{service.shortDescription}</p>
        </div>
      </section>

      {/* Detail Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Description */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-serif text-3xl font-bold text-stone-900">Overview & Scope</h2>
              <p className="text-stone-700 mt-4 leading-relaxed text-base">
                {service.description}
              </p>
            </div>

            {/* Features */}
            {service.features && service.features.length > 0 && (
              <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-6">Key Specifications & Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start space-x-3 text-sm text-stone-800">
                      <CheckCircle2 className="w-5 h-5 text-[#C4795A] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar CTA Card */}
          <div className="space-y-6">
            <div className="bg-stone-900 text-white p-8 rounded-2xl shadow-xl space-y-6">
              <h3 className="font-serif text-2xl font-bold text-[#C4795A]">Request Service Quote</h3>
              <p className="text-stone-300 text-xs leading-relaxed">
                Consult with our senior Dubai renovation engineers. Fixed pricing with zero surprise charges.
              </p>
              <Link
                to={`/book-consultation?service=${encodeURIComponent(service.name)}`}
                className="w-full btn-terracotta text-center py-3.5 rounded-xl font-semibold text-sm block shadow-lg"
              >
                Book Consultation For {service.name}
              </Link>
              <div className="pt-4 border-t border-stone-800 text-xs text-stone-400 space-y-2">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>DDA & Municipality Compliant</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
