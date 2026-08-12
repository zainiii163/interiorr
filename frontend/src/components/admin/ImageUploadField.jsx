import React, { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { uploadImageFile } from '../../services/upload';

export default function ImageUploadField({ label, value, onChange, placeholder = 'https://...' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const url = await uploadImageFile(file);
      onChange(url);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      {label && <label className="block font-bold mb-1">{label}</label>}
      <div className="flex gap-2">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border rounded-xl text-xs"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 flex items-center gap-1 shrink-0 disabled:opacity-60"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          <span className="text-[10px] font-semibold">{uploading ? 'Uploading' : 'Upload'}</span>
        </button>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
      </div>
      {value && (
        <img src={value} alt="" className="mt-2 h-20 w-auto max-w-full rounded-lg border object-cover" />
      )}
      {error && <p className="text-rose-600 text-[10px] mt-1">{error}</p>}
    </div>
  );
}
