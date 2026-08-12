import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { apiFetch } from '../services/api';

export default function StyleDetail() {
  const { slug } = useParams();
  const [style, setStyle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStyle = async () => {
      try {
        const res = await apiFetch(`/design-styles/${slug}`);
        if (res.success) setStyle(res.data);
      } catch (e) {
        console.error('Error fetching style:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStyle();
  }, [slug]);

  if (loading) return <div className="pt-32 text-center py-20 font-serif text-xl">Loading Style...</div>;
  if (!style) return <div className="pt-32 text-center py-20 font-serif text-xl">Style Not Found</div>;

  return (
    <div className="page-offset pb-20">
      <section className="relative h-[55vh] flex items-center justify-center bg-stone-900 text-white overflow-hidden">
        <img src={style.image} alt={style.name} className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">Signature Aesthetic</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold mt-2">{style.name}</h1>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16 space-y-12">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <h2 className="font-serif text-3xl font-bold text-stone-900">Design Philosophy</h2>
          <p className="text-stone-700 leading-relaxed text-base">{style.description}</p>
          
          {style.characteristics && style.characteristics.length > 0 && (
            <div className="pt-6 border-t border-stone-100">
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-4">Key Style Characteristics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {style.characteristics.map((char, idx) => (
                  <div key={idx} className="flex items-center space-x-3 text-sm text-stone-800">
                    <CheckCircle2 className="w-5 h-5 text-[#5C7A6B] shrink-0" />
                    <span>{char}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link
            to="/book-consultation"
            className="btn-terracotta inline-block px-8 py-3.5 rounded-xl font-semibold text-sm shadow-xl"
          >
            Design My Home in {style.name} Style
          </Link>
        </div>
      </section>
    </div>
  );
}
