import { Link } from 'react-router-dom';

/** Company logo or initial fallback for navbar, footer, and portal. */
export default function BrandLogo({ settings, onClick, className = '', imageClassName = 'h-10 sm:h-12 w-auto object-contain' }) {
  const logoUrl = settings?.logoUrl || '/logo.jpg';
  const company = settings?.companyName || 'Hulul Al Madina Interiors';
  const shortName = company.split(' ').slice(0, 2).join(' ') || company;

  const content = logoUrl ? (
    <img src={logoUrl} alt={`${company} logo`} className={imageClassName} />
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
      <div className="min-w-0 hidden sm:block">
        <span className="block font-serif text-lg font-bold tracking-wide text-white group-hover:text-[#F58220] transition-colors truncate">
          {shortName}
        </span>
        {settings?.tagline && (
          <span className="block text-[10px] tracking-widest text-stone-400 uppercase font-sans font-semibold truncate max-w-[220px] 2xl:max-w-[280px]">
            {settings.tagline}
          </span>
        )}
      </div>
    </Link>
  );
}
