import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ShieldCheck, CheckCircle2, Globe } from 'lucide-react';
import { apiFetch } from '../services/api';
import EmptyState from '../components/ui/EmptyState';
import { useSite } from '../context/SiteContext';
import { usePageCopy } from '../utils/pageCopy';

export default function Reviews() {
  const { settings } = useSite();
  const copy = usePageCopy(settings);
  const [reviews, setReviews] = useState([]);
  const [filterSource, setFilterSource] = useState('all'); // 'all' | 'google' | 'direct'
  const [avgRating, setAvgRating] = useState(settings.statistics?.customerRating || 0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await apiFetch('/reviews');
        if (res.success) {
          setReviews(res.data);
          if (res.meta && res.meta.averageRating) {
            setAvgRating(res.meta.averageRating);
          }
        }
      } catch (e) {
        console.error('Error fetching reviews:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter((r) => {
    if (filterSource === 'google') return r.source === 'google';
    if (filterSource === 'direct') return r.source === 'direct';
    return true;
  });

  const googleCount = reviews.filter((r) => r.source === 'google').length;

  return (
    <div className="page-offset pb-20 font-sans">
      
      {/* Top Banner */}
      <section className="bg-stone-900 text-white py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">
            Client Satisfaction & Trust
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mt-2">
            {copy.reviewsHeroTitle || 'Google Reviews & Testimonials'}
          </h1>
          <p className="text-stone-400 text-sm max-w-xl mx-auto mt-3">
            {copy.reviewsHeroBody || 'Real feedback from clients across Dubai'}
          </p>

          {/* Google Business Profile Rating Badge */}
          <div className="mt-8 inline-flex flex-col sm:flex-row items-center gap-4 bg-stone-950/80 px-6 py-4 rounded-2xl border border-stone-800 shadow-xl">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-blue-600 shadow">
                G
              </div>
              <div className="text-left">
                <div className="font-bold text-white text-xs">Google Business Profile</div>
                <div className="text-[10px] text-stone-400">Verified Dubai Reviews</div>
              </div>
            </div>

            <div className="h-8 w-px bg-stone-800 hidden sm:block"></div>

            <div className="flex items-center space-x-2">
              <div className="flex text-amber-400 space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-500" />
                ))}
              </div>
              <span className="text-white text-base font-bold font-mono">{avgRating} / 5.0</span>
              <span className="text-stone-400 text-xs">({reviews.length} reviews)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex justify-center space-x-3 text-xs font-semibold">
          <button
            onClick={() => setFilterSource('all')}
            className={`px-4 py-2 rounded-xl transition ${
              filterSource === 'all'
                ? 'bg-[#C4795A] text-white shadow'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setFilterSource('google')}
            className={`px-4 py-2 rounded-xl transition flex items-center space-x-1.5 ${
              filterSource === 'google'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <span>Google Reviews ({googleCount})</span>
          </button>
          <button
            onClick={() => setFilterSource('direct')}
            className={`px-4 py-2 rounded-xl transition ${
              filterSource === 'direct'
                ? 'bg-[#C4795A] text-white shadow'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            Client Testimonials ({reviews.length - googleCount})
          </button>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-8 rounded-2xl bg-white border border-stone-200 shadow-sm animate-pulse">
                <div className="h-4 bg-stone-200 rounded w-24 mb-4" />
                <div className="h-4 bg-stone-200 rounded mb-2" />
                <div className="h-4 bg-stone-200 rounded w-5/6 mb-2" />
                <div className="h-4 bg-stone-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredReviews.map((rev) => (
              <div
                key={rev._id}
                className="p-8 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-amber-400 space-x-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-500" />
                      ))}
                    </div>
                    {rev.source === 'google' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-blue-600" />
                        <span>Google Business</span>
                      </span>
                    )}
                  </div>

                  <p className="text-stone-700 text-xs sm:text-sm leading-relaxed italic">
                    "{rev.reviewText || rev.content}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center space-x-3">
                  {rev.authorPhoto ? (
                    <img
                      src={rev.authorPhoto}
                      alt={rev.customerName || rev.authorName}
                      className="w-10 h-10 rounded-full object-cover border border-stone-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-stone-100 text-[#C4795A] font-bold flex items-center justify-center uppercase text-sm border border-stone-200">
                      {(rev.customerName || rev.authorName || 'C').charAt(0)}
                    </div>
                  )}

                  <div>
                    <div className="font-serif font-bold text-stone-900 text-sm">
                      {rev.customerName || rev.authorName}
                    </div>
                    <div className="text-[11px] text-stone-500 font-medium">
                      {rev.authorTitle || 'Dubai Client'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="search"
            title="No reviews found"
            description="No reviews match the selected filter. Try a different filter or check back later."
          />
        )}
      </section>

    </div>
  );
}

