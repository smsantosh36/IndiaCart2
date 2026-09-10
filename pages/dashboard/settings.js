import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { uploadImageFile } from '../../lib/uploadClient';

export default function Settings() {
  const [logoImage, setLogoImage] = useState('');
  const [siteTitle, setSiteTitle] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [showBanners, setShowBanners] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        setLogoImage(data.logoImage || '');
        setSiteTitle(data.siteTitle || '');
        setSiteDescription(data.siteDescription || '');
        setShowBanners(data.showBanners !== false);
      });
  }, []);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Logo image 2MB se choti honi chahiye');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const url = await uploadImageFile(file, 'logo');
      setLogoImage(url);
      setMessage('');
    } catch (err) {
      setError(err.message || 'Image upload fail ho gaya');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logoImage, siteTitle, siteDescription, showBanners })
    });
    setSaving(false);
    setMessage('Settings save ho gayi');
  }

  function handleRemove() {
    setLogoImage('');
    setMessage('');
  }

  return (
    <DashboardLayout title="Settings">
      <div className="bg-white border border-line rounded-2xl p-6 max-w-lg space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Nav bar logo</label>
          <div className="bg-ink rounded-lg p-4 mb-3 flex items-center">
            {logoImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoImage} alt="Logo preview" className="h-9 object-contain" />
            ) : (
              <span className="font-display text-xl text-white">
                Deal<span className="text-mango">Loop</span>
              </span>
            )}
          </div>

          {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

          <input type="file" accept="image/*" onChange={handleFile} className="text-sm" disabled={uploading} />
          <p className="text-xs text-muted mt-1">
            {uploading ? 'Uploading...' : 'PNG (transparent background) best rahega. 2MB tak.'}
          </p>

          {logoImage && (
            <button
              onClick={handleRemove}
              type="button"
              className="text-xs text-red-500 hover:underline mt-2"
            >
              Remove logo (text logo par wapas)
            </button>
          )}
        </div>

        <div className="border-t border-line pt-5">
          <p className="text-sm font-semibold mb-3">Home page SEO</p>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">SEO title</label>
            <input
              type="text"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              placeholder="e.g. DealLoop — Best deals across every category"
              className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">SEO meta description</label>
            <textarea
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              rows={2}
              placeholder="Google search results mein dikhne wali 1-2 line"
              className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
            />
          </div>
        </div>

        <div className="border-t border-line pt-5">
          <p className="text-sm font-semibold mb-3">Advertisement banners</p>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showBanners}
              onChange={(e) => setShowBanners(e.target.checked)}
              className="w-4 h-4"
            />
            Homepage par "Advertisement" banner section dikhayein
          </label>
          <p className="text-xs text-muted mt-1">
            Is se off karne par banners kahin bhi (homepage ya "View all" page par) nahi
            dikhenge, chahe Dashboard → Banners mein images add ki hui hon.
          </p>
        </div>

        {message && <p className="text-sm text-teal">{message}</p>}

        <button
          onClick={handleSave}
          disabled={saving || uploading}
          className="bg-mango text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-orange-500 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save settings'}
        </button>
      </div>
    </DashboardLayout>
  );
}
