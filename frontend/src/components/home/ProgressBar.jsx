import { useEffect, useState } from 'react';
import { useInView } from '../../hooks/useInView';

export default function ProgressBar({ label, value, delay = 0 }) {
  const [ref, inView] = useInView();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setWidth(value), delay + 150);
    return () => clearTimeout(t);
  }, [inView, value, delay]);

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between text-sm font-semibold text-stone-700">
        <span>{label}</span>
        <span className="text-[#C4795A]">{width}%</span>
      </div>
      <div className="h-2.5 bg-stone-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#C4795A] to-[#5C7A6B] rounded-full transition-all duration-[1.2s] ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
