import { useEffect, useState } from 'react';
import { useInView } from '../../hooks/useInView';

export default function AnimatedCounter({ value, suffix = '', decimals = 0, duration = 1800 }) {
  const [ref, inView] = useInView();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const target = Number(value) || 0;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const current = target * eased;
      setDisplay(decimals ? Number(current.toFixed(decimals)) : Math.floor(current));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, value, duration, decimals]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
