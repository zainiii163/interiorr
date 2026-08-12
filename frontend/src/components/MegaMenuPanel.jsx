import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';

export default function MegaMenuPanel({ item, children = [], onClose }) {
  const [hovered, setHovered] = useState(null);

  const title = item.megaMenuTitle || item.label;
  const ctaLabel = item.megaMenuCtaLabel || `Explore ${item.label}`;
  const ctaPath = item.megaMenuCtaPath || item.path;

  const activeChild = hovered || children[0];
  const previewImage = activeChild?.image;
  const previewLabel = activeChild?.label;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!children.length) return null;

  return (
    <div className="mega-menu-panel open" role="dialog" aria-label={`${title} menu`}>
      <div className="mega-menu-inner">
        <div className="mega-menu-links">
          <h3 className="mega-menu-title">{title}</h3>
          <ul className="mega-menu-list mega-menu-list-triple">
            {children.map((child) => (
              <li key={child._id || child.path}>
                <Link
                  to={child.path}
                  className={`mega-menu-link ${activeChild?.path === child.path ? 'hovered' : ''}`}
                  onMouseEnter={() => setHovered(child)}
                  onFocus={() => setHovered(child)}
                  onClick={onClose}
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mega-menu-cta">
            <Link to={ctaPath} className="btn-default mega-menu-explore-btn" onClick={onClose}>
              {ctaLabel} <ArrowRight className="w-4 h-4 inline ml-1" />
            </Link>
          </div>
        </div>

        <div className="mega-menu-image">
          <div className="mega-menu-image-wrapper">
            {previewImage ? (
              <img src={previewImage} alt={previewLabel || title} loading="lazy" />
            ) : (
              <div className="mega-menu-image-placeholder" />
            )}
            <div className="mega-menu-image-overlay">
              <span className="mega-menu-image-label">{previewLabel || title}</span>
            </div>
          </div>
        </div>
      </div>

      <button type="button" className="mega-menu-close" aria-label="Close menu" onClick={onClose}>
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
