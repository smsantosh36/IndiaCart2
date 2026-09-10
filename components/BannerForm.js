import { useState } from 'react';
import { uploadImageFile } from '../lib/uploadClient';

export default function BannerForm({ initial, onSubmit, submitLabel }) {
  const [image, setImage] = useState(initial?.image || '');
  const [link, setLink] = useState(initial?.link || '');
  const [title, setTitle] = useState(initial?.title || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setError('Banner image 4MB se choti honi chahiye');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const url = await uploadImageFile(file, 'banner');
      setImage(url);
    } catch (err) {
      setError(err.message || 'Image upload fail ho gaya');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!image) {
      setError('Banner image zaroori hai');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit({ image, link, title });
    } catch (err) {
      setError(err.message || 'Kuch ghalat ho gaya');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-line rounded-2xl p-6 max-w-lg space-y-5">
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div>
        <label className="block text-sm font-medium mb-1">Banner image (upload)</label>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt="preview"
            className="w-full aspect-video object-cover rounded-lg mb-2 border border-line"
          />
        )}
        <input type="file" accept="image/*" onChange={handleFile} className="text-sm" disabled={uploading} />
        <p className="text-xs text-muted mt-1">
          {uploading ? 'Uploading...' : 'JPG/PNG, 4MB tak. Wide/landscape image best rahegi.'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Click-through link (optional)</label>
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://..."
          className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
        />
        <p className="text-xs text-muted mt-1">
          Banner par click karne par ye link naye tab mein khulega. Khaali chodne par banner click-able nahi hoga.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Alt text (optional)</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Banner ka short description"
          className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={saving || uploading}
        className="bg-mango text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-orange-500 transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
