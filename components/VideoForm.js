import { useState } from 'react';

export default function VideoForm({ initial, onSubmit, submitLabel }) {
  const [url, setUrl] = useState(initial?.url || '');
  const [caption, setCaption] = useState(initial?.caption || '');
  const [followUrl, setFollowUrl] = useState(initial?.followUrl || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim()) {
      setError('Video URL zaroori hai');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit({ url, caption, followUrl });
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
        <label className="block text-sm font-medium mb-1">Video URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Instagram Reel / YouTube / Pinterest link paste karein"
          className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
        />
        <p className="text-xs text-muted mt-1">
          Instagram, YouTube, Pinterest — koi bhi real/video ka link chalega.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Caption (optional)</label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={2}
          className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Follow URL (optional)</label>
        <input
          type="url"
          value={followUrl}
          onChange={(e) => setFollowUrl(e.target.value)}
          placeholder="https://instagram.com/yourbrand"
          className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
        />
        <p className="text-xs text-muted mt-1">
          "Follow" button click karne par ye link naye tab mein khulega.
        </p>
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
