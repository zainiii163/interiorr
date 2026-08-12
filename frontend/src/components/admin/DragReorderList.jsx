import { useState } from 'react';
import { GripVertical } from 'lucide-react';

/**
 * Lightweight HTML5 drag-and-drop reorder list.
 * items: array with _id
 * onReorder(nextItems): parent updates local state + persists
 */
export default function DragReorderList({
  items,
  onReorder,
  renderItem,
  disabled = false,
  className = '',
}) {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const move = (from, to) => {
    if (from === to || from == null || to == null) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onReorder(next.map((item, order) => ({ ...item, order })));
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => (
        <div
          key={item._id}
          draggable={!disabled}
          onDragStart={() => setDragIndex(index)}
          onDragEnd={() => {
            if (dragIndex != null && overIndex != null) move(dragIndex, overIndex);
            setDragIndex(null);
            setOverIndex(null);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (overIndex !== index) setOverIndex(index);
          }}
          className={`flex items-stretch gap-2 rounded-xl border bg-white transition ${
            overIndex === index && dragIndex !== index
              ? 'border-[#C4795A] ring-2 ring-[#C4795A]/20'
              : 'border-stone-200'
          } ${dragIndex === index ? 'opacity-60' : ''}`}
        >
          <button
            type="button"
            disabled={disabled}
            className="px-2 text-stone-400 hover:text-stone-700 cursor-grab active:cursor-grabbing shrink-0"
            title="Drag to reorder"
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0 py-2 pr-3">{renderItem(item, index)}</div>
        </div>
      ))}
    </div>
  );
}
