import { useState } from 'react';
import { uploadImageFile } from '../lib/uploadClient';

export default function CategoryForm({ initial, onSubmit, submitLabel }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [image, setImage] = useState(initial?.image || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setError('Image 3MB se choti honi chahiye');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const url = await uploadImageFile(file, 'category');
      setImage(url);
    } catch (err) {
      setError(err.message || 'Image upload fail ho gaya');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title zaroori hai');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit({ title, image, description, seoTitle, seoDescription });
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
        <label className="block text-sm font-medium mb-1">Category title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Electronics"
          className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category image (upload)</label>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="preview" className="w-full aspect-video object-cover rounded-lg mb-2 border border-line" />
        )}
        <input type="file" accept="image/*" onChange={handleFile} className="text-sm" disabled={uploading} />
        <p className="text-xs text-muted mt-1">
          {uploading ? 'Uploading...' : 'JPG/PNG, 3MB tak.'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Is category page par upar dikhne wala short intro"
          className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
        />
      </div>

      <div className="border-t border-line pt-4">
        <p className="text-sm font-semibold mb-3">SEO (search engines ke liye)</p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">SEO title</label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="Khaali chodne par category title use hoga"
            className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">SEO meta description</label>
          <textarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            rows={2}
            placeholder="Google search results mein dikhne wali 1-2 line"
            className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
          />
        </div>
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
