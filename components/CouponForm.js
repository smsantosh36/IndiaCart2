import { useState } from 'react';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CouponForm({ initial, onSubmit, submitLabel }) {
  const [brandName, setBrandName] = useState(initial?.brandName || '');
  const [brandLogo, setBrandLogo] = useState(initial?.brandLogo || '');
  const [discountText, setDiscountText] = useState(initial?.discountText || '');
  const [code, setCode] = useState(initial?.code || '');
  const [affiliateUrl, setAffiliateUrl] = useState(initial?.affiliateUrl || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Brand logo 2MB se choti honi chahiye');
      return;
    }
    setError('');
    const base64 = await fileToBase64(file);
    setBrandLogo(base64);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!brandName.trim()) return setError('Brand name zaroori hai');
    if (!discountText.trim()) return setError('Discount text zaroori hai (e.g. Flat 20% OFF)');
    if (!code.trim()) return setError('Coupon code zaroori hai');

    setSaving(true);
    setError('');
    try {
      await onSubmit({ brandName, brandLogo, discountText, code, affiliateUrl });
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
        <label className="block text-sm font-medium mb-1">Brand name</label>
        <input
          type="text"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="e.g. Myntra"
          className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Brand logo (upload)</label>
        {brandLogo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brandLogo}
            alt="preview"
            className="h-16 w-16 object-contain rounded-lg mb-2 border border-line bg-paper p-2"
          />
        )}
        <input type="file" accept="image/*" onChange={handleFile} className="text-sm" />
        <p className="text-xs text-muted mt-1">JPG/PNG, 2MB tak.</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Discount text</label>
        <input
          type="text"
          value={discountText}
          onChange={(e) => setDiscountText(e.target.value)}
          placeholder="e.g. Flat 20% OFF"
          className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Coupon code</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. SAVE20"
          className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none font-mono uppercase"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Store / affiliate URL (optional)</label>
        <input
          type="url"
          value={affiliateUrl}
          onChange={(e) => setAffiliateUrl(e.target.value)}
          placeholder="https://..."
          className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
        />
        <p className="text-xs text-muted mt-1">
          Agar diya to "Show code" click karte hi store naye tab mein khulega.
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
