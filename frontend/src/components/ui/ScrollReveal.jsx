import { useInView } from '../../hooks/useInView';

export default function ScrollReveal({ children, className = '', delay = 0, direction = 'up' }) {
  const [ref, inView] = useInView();

  return (
    <div
      ref={ref}
      className={`scroll-reveal scroll-reveal-${direction} ${inView ? 'scroll-reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
