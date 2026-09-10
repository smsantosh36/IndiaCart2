import { useState } from 'react';

export default function PageForm({ initial, onSubmit, submitLabel }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [content, setContent] = useState(initial?.content || '');
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Page title zaroori hai');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit({ title, content, seoTitle, seoDescription });
    } catch (err) {
      setError(err.message || 'Kuch ghalat ho gaya');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-line rounded-2xl p-6 max-w-2xl space-y-5">
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div>
        <label className="block text-sm font-medium mb-1">Page title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. About Us"
          className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
        />
        {initial?.slug && (
          <p className="text-xs text-muted mt-1">URL: /{initial.slug}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          placeholder="Is page ka main content yahan likhein"
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
            placeholder="Khaali chodne par page title use hoga"
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
        disabled={saving}
        className="bg-mango text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-orange-500 transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
