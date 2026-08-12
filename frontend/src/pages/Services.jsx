import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { apiFetch } from '../services/api';

const fallbackImage = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="#f5ede8"/><rect x="40" y="40" width="1120" height="720" rx="24" fill="#fff7f2" stroke="#d9b7a4" stroke-width="4"/><text x="600" y="390" text-anchor="middle" font-family="Arial" font-size="32" fill="#8a5a3d">Luxury Interior Service</text></svg>');

export default function Services() {
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await apiFetch('/services');
        if (res.success) setServices(res.data);
      } catch (e) {
        console.error('Failed to load services:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const categories = ['All', ...new Set(services.map(s => s.category))];

  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter(s => s.category === selectedCategory);

  return (
    <div className="page-offset pb-20">
      
      {/* Header */}
      <section className="bg-gradient-to-r from-stone-900 to-[#1A1817] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-[#C4795A] font-semibold text-sm uppercase tracking-widest">Architectural Capabilities</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold mt-4">Renovation & Fit-Out Services</h1>
          <p className="text-stone-300 mt-6 max-w-3xl mx-auto text-lg">
            Discover our comprehensive suite of Dubai residential, commercial, and bespoke joinery services.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-[#C4795A] text-white shadow-lg'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-200 animate-pulse">
                <div className="h-80 bg-stone-200" />
                <div className="p-8 space-y-4">
                  <div className="h-5 bg-stone-200 rounded w-24" />
                  <div className="h-7 bg-stone-200 rounded w-3/4" />
                  <div className="h-4 bg-stone-200 rounded" />
                  <div className="h-4 bg-stone-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredServices.map((service) => (
              <Link
                key={service._id}
                to={`/services/${service.slug}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-500 border border-stone-200 flex flex-col"
              >
                <div className="h-80 overflow-hidden relative">
                  <img
                    src={service.heroImage || fallbackImage}
                    alt={service.name}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackImage;
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                  <span className="absolute top-6 left-6 bg-[#C4795A] text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
                    {service.category}
                  </span>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-stone-900 group-hover:text-[#C4795A] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-stone-600 mt-4 leading-relaxed">
                      {service.shortDescription}
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-stone-200 flex items-center text-sm font-semibold text-[#C4795A] space-x-2">
                    <span>View Details & Specs</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-stone-600">
            No services available right now.
          </div>
        )}
      </section>

    </div>
  );
}
