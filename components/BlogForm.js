import { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import { uploadImageFile } from '../lib/uploadClient';

export default function BlogForm({ initial, onSubmit, submitLabel }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [featuredImage, setFeaturedImage] = useState(initial?.featuredImage || '');
  const [content, setContent] = useState(initial?.content || '');
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setError('Featured image 3MB se choti honi chahiye');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const url = await uploadImageFile(file, 'blog');
      setFeaturedImage(url);
    } catch (err) {
      setError(err.message || 'Image upload fail ho gaya');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Blog title zaroori hai');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit({ title, featuredImage, content, seoTitle, seoDescription });
    } catch (err) {
      setError(err.message || 'Kuch ghalat ho gaya');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-line rounded-2xl p-6 max-w-3xl space-y-5">
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div>
        <label className="block text-sm font-medium mb-1">Blog title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Top 5 Diwali Deals This Year"
          className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
        />
        {initial?.slug && <p className="text-xs text-muted mt-1">URL: /blog/{initial.slug}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Featured image (upload)</label>
        {featuredImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={featuredImage}
            alt="preview"
            className="w-full aspect-video object-cover rounded-lg mb-2 border border-line"
          />
        )}
        <input type="file" accept="image/*" onChange={handleFile} className="text-sm" disabled={uploading} />
        <p className="text-xs text-muted mt-1">{uploading ? 'Uploading...' : 'JPG/PNG, 3MB tak.'}</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Content</label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div className="border-t border-line pt-4">
        <p className="text-sm font-semibold mb-3">SEO (search engines ke liye)</p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">SEO title</label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="Khaali chodne par blog title use hoga"
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
