import { useState } from 'react';
import { Link } from 'react-router-dom';
import defaultLogo from '../assets/brand-logo.jpg';

const BUNDLED_LOGO_PATHS = new Set([
  '/logo.jpg',
  '/favicon.jpg',
  '/assets/brand-logo.jpg',
  'assets/brand-logo.jpg',
  'brand-logo.jpg',
]);

function resolveLogoSrc(settings) {
  const url = settings?.logoUrl?.trim();
  if (!url || BUNDLED_LOGO_PATHS.has(url)) return defaultLogo;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return url;
  return `/${url}`;
}

/** Company logo or initial fallback for navbar, footer, and portal. */
export default function BrandLogo({
  settings,
  onClick,
  className = '',
  imageClassName = 'h-10 sm:h-12 w-auto max-w-[140px] object-contain bg-white rounded-md p-1',
  showText = true,
  showTagline = true,
}) {
  const company = settings?.companyName || '';
  const shortName = company || '';
  const [imgFailed, setImgFailed] = useState(false);
  const logoSrc = resolveLogoSrc(settings);

  const content =
    !imgFailed && logoSrc ? (
      <img
        src={logoSrc}
        alt={`${company} logo`}
        className={imageClassName}
        onError={() => setImgFailed(true)}
      />
    ) : (
      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#1B365D] to-[#F58220] flex items-center justify-center text-white font-serif font-bold text-xl shadow-xl ring-2 ring-white/20 shrink-0">
        {company.charAt(0)}
      </div>
    );

  if (onClick === false) {
    return <div className={`flex items-center gap-3 min-w-0 shrink-0 ${className}`}>{content}</div>;
  }

  return (
    <Link to="/" onClick={onClick} className={`flex items-center gap-3 group min-w-0 shrink-0 ${className}`}>
      {content}
      {showText && (
        <div className="min-w-0 hidden sm:block max-w-[200px] xl:max-w-[260px]">
          <span className="block font-serif text-base xl:text-lg font-bold tracking-wide text-white group-hover:text-[#F58220] transition-colors truncate">
            {shortName}
          </span>
          {showTagline && settings?.tagline && (
            <span className="block text-[10px] tracking-widest text-stone-400 uppercase font-sans font-semibold truncate max-w-[220px] 2xl:max-w-[320px]">
              {settings.tagline}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
