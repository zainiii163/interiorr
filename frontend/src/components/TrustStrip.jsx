import { ShieldCheck, Lock, Star, BadgeCheck, Award } from 'lucide-react';
import { useSite } from '../context/SiteContext';

const ICONS = [ShieldCheck, Lock, Star, BadgeCheck];

export default function TrustStrip() {
  const { settings } = useSite();
  const stats = settings.statistics || {};
  const sourceBadges =
    settings.heroTrustBadges?.length > 0
      ? settings.heroTrustBadges
      : settings.certifications?.length > 0
        ? settings.certifications
        : [];

  if (!sourceBadges.length) return null;

  const badges = sourceBadges.slice(0, 4).map((label, i) => ({
    icon: ICONS[i % ICONS.length] || Award,
    label,
  }));

  if (stats.customerRating) {
    const ratingIdx = badges.findIndex((b) => b.label.toLowerCase().includes('review') || b.label.includes('★'));
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
