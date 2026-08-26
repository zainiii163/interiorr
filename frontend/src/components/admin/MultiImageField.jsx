import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ImageUploadField from './ImageUploadField';

export default function MultiImageField({ label = 'Images', images = [], onChange, maxImages = 6 }) {
  const [draft, setDraft] = useState('');
  const list = Array.isArray(images) ? images.filter(Boolean) : [];

  const addUrl = (url) => {
    const next = url?.trim();
    if (!next) return;
    if (list.includes(next)) return;
    if (list.length >= maxImages) return;
    onChange([...list, next]);
    setDraft('');
  };

  const removeAt = (index) => {
    onChange(list.filter((_, i) => i !== index));
  };

  return (
    <div>
      {label && <label className="block font-bold mb-1">{label}</label>}
      <p className="text-[10px] text-stone-500 mb-2">
        Upload photos from your projects (Cloudinary) or paste a URL. Max {maxImages}.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
        {list.map((url, index) => (
          <div key={`${url}-${index}`} className="relative group">
            <img src={url} alt="" className="h-20 w-full object-cover rounded-lg border" />
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="absolute top-1 right-1 p-1 rounded bg-white/90 text-rose-600 opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      {list.length < maxImages && (
        <div className="space-y-2">
          <ImageUploadField
            label=""
            value={draft}
            onChange={(url) => {
              if (url && url !== draft && url.startsWith('http')) addUrl(url);
              else setDraft(url);
            }}
            placeholder="Paste image URL or upload"
          />
          {draft && (
            <button
              type="button"
              onClick={() => addUrl(draft)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 text-stone-700 text-[10px] font-semibold"
            >
              <Plus className="w-3 h-3" /> Add image
            </button>
          )}
        </div>
      )}
    </div>
  );
}
