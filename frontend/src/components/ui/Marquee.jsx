import { useState } from 'react';
import { resolveMediaUrl } from '../../utils/mediaUrl';

export default function Marquee({ items, speed = 30 }) {
  const [failedIds, setFailedIds] = useState(() => new Set());

  if (!items?.length) return null;

  const loop = [...items, ...items];
  const markFailed = (id) => setFailedIds((prev) => new Set(prev).add(id));

  return (
    <div className="marquee-wrap overflow-hidden py-4">
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        {loop.map((item, i) => (
          <div key={`${item._id || item}-${i}`} className="marquee-item">
            {typeof item === 'string' ? (
              <span className="font-serif text-lg font-bold text-stone-400 hover:text-[#C4795A] transition-colors px-8">
                {item}
              </span>
            ) : (
              <div className="flex items-center gap-3 px-10">
                {item.logo && !failedIds.has(item._id || item.name) ? (
                  <img
                    src={resolveMediaUrl(item.logo)}
                    alt={item.name}
                    className="h-8 max-w-[120px] object-contain opacity-70 hover:opacity-100 transition"
                    onError={() => markFailed(item._id || item.name)}
                  />
                ) : (
                  <span className="font-serif text-lg font-bold text-stone-400 hover:text-[#C4795A] transition-colors whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
