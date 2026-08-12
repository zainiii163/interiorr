export default function Marquee({ items, speed = 30 }) {
  if (!items?.length) return null;

  const loop = [...items, ...items];

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
                {item.logo ? (
                  <img src={item.logo} alt={item.name} className="h-8 opacity-70 hover:opacity-100 transition" />
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
