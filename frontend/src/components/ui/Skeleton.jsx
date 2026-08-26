import React from 'react';

/**
 * Reusable skeleton loading component
 * Provides smooth placeholder animations while data loads
 */

export function SkeletonBlock({ className = '', rounded = 'rounded-2xl' }) {
  return (
    <div className={`bg-stone-200 animate-pulse ${rounded} ${className}`} />
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-stone-200 animate-pulse rounded ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ hasImage = true, imageHeight = 'h-64', textLines = 3 }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200">
      {hasImage && <div className={`${imageHeight} bg-stone-200 animate-pulse`} />}
      <div className="p-6 space-y-3">
        <div className="h-3 bg-stone-200 rounded animate-pulse w-20" />
        <div className="h-6 bg-stone-200 rounded animate-pulse w-3/4" />
        {Array.from({ length: textLines }).map((_, i) => (
          <div key={i} className="h-4 bg-stone-200 rounded animate-pulse" style={{ width: `${90 - i * 15}%` }} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6, cols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', gap = 'gap-8' }) {
  return (
    <div className={`grid ${cols} ${gap}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonHero() {
  return (
    <section className="bg-gradient-to-r from-stone-900 to-[#1A1817] py-20">
      <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
        <div className="h-4 bg-stone-800 rounded animate-pulse w-48 mx-auto" />
        <div className="h-12 bg-stone-800 rounded animate-pulse w-96 mx-auto" />
        <div className="h-4 bg-stone-800 rounded animate-pulse w-72 mx-auto" />
      </div>
    </section>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="flex gap-4">
          {Array.from({ length: cols }).map((_, col) => (
            <div
              key={col}
              className="h-10 bg-stone-100 rounded animate-pulse flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonCircle({ size = 'w-12 h-12' }) {
  return <div className={`${size} bg-stone-200 rounded-full animate-pulse`} />;
}

export default function Skeleton({ variant = 'block', ...props }) {
  const variants = {
    block: SkeletonBlock,
    text: SkeletonText,
    card: SkeletonCard,
    grid: SkeletonGrid,
    hero: SkeletonHero,
    table: SkeletonTable,
    circle: SkeletonCircle,
  };
  const Component = variants[variant] || SkeletonBlock;
  return <Component {...props} />;
}
