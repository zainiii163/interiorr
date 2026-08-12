import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { apiFetch } from '../services/api';

export default function DesignStyles() {
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const res = await apiFetch('/design-styles');
        if (res.success) setStyles(res.data);
      } catch (e) {
        console.error('Error fetching design styles:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStyles();
  }, []);

  return (
    <div className="page-offset pb-20">
      
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">Aesthetic Direction</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mt-2">Interior Design Styles</h1>
          <p className="text-stone-300 mt-3 max-w-2xl mx-auto text-sm">
            Explore curated design philosophies tailored for Dubai luxury living.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 animate-pulse">
                <div className="h-64 bg-stone-200" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-stone-200 rounded w-3/4" />
                  <div className="h-4 bg-stone-200 rounded" />
                  <div className="h-4 bg-stone-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : styles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {styles.map((style) => (
              <Link
                key={style._id}
                to={`/design-styles/${style.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-stone-200 flex flex-col"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={style.image}
                    alt={style.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-stone-900 group-hover:text-[#C4795A] transition-colors">
                      {style.name}
                    </h3>
                    <p className="text-stone-600 text-sm mt-3 leading-relaxed line-clamp-3">
                      {style.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center text-xs font-semibold text-[#C4795A] space-x-1">
                    <span>Explore Style Characteristics</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-stone-600">No design styles available right now.</div>
        )}
      </section>

    </div>
  );
}
