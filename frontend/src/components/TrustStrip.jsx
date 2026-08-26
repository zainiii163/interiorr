import { ShieldCheck, Lock, Star, BadgeCheck, Award } from 'lucide-react';
import { useSite } from '../context/SiteContext';

const DEFAULT_ITEMS = [
  { icon: ShieldCheck, label: 'Licensed UAE Contractor' },
  { icon: Lock, label: 'Secure Data & Payments' },
  { icon: Star, label: '4.9★ Google Reviews' },
  { icon: BadgeCheck, label: '500+ Projects Delivered' },
];

export default function TrustStrip() {
  const { settings } = useSite();
  const stats = settings.statistics || {};
  const badges = settings.heroTrustBadges?.length
    ? settings.heroTrustBadges.slice(0, 4).map((label) => ({ icon: Award, label }))
    : DEFAULT_ITEMS;

  if (stats.customerRating) {
    const ratingIdx = badges.findIndex((b) => b.label.includes('Google') || b.label.includes('★'));
    if (ratingIdx >= 0) {
      badges[ratingIdx] = { icon: Star, label: `${stats.customerRating}★ Google Reviews` };
    }
  }
  if (stats.completedProjects) {
    const projIdx = badges.findIndex((b) => b.label.toLowerCase().includes('project'));
    if (projIdx >= 0) {
      badges[projIdx] = { icon: BadgeCheck, label: `${stats.completedProjects}+ Projects Delivered` };
    }
  }

  return (
    <section
      className="trust-strip border-y border-stone-200 bg-white/95 backdrop-blur-sm"
      aria-label="Why clients trust us"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:gap-x-10">
          {badges.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2 text-xs sm:text-sm text-stone-700 font-medium">
              <Icon className="w-4 h-4 text-[#C4795A] shrink-0" aria-hidden="true" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
