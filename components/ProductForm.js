import { useEffect, useMemo, useState } from 'react';

function calcDiscount(regular, sale) {
  const reg = Number(regular);
  const s = Number(sale);
  if (!reg || reg <= 0 || s == null || s === '') return 0;
  const pct = ((reg - s) / reg) * 100;
  return Math.max(0, Math.round(pct * 100) / 100);
}

export default function ProductForm({ initial, categories, brands = [], onSubmit, submitLabel }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [categoryId, setCategoryId] = useState(initial?.categoryId || categories[0]?.id || '');
  const [brandId, setBrandId] = useState(initial?.brandId || '');
  const [regularPrice, setRegularPrice] = useState(initial?.regularPrice ?? '');
  const [salePrice, setSalePrice] = useState(initial?.salePrice ?? '');
  const [shortDescription, setShortDescription] = useState(initial?.shortDescription || '');
  const [affiliateUrl, setAffiliateUrl] = useState(initial?.affiliateUrl || '');
  const [images, setImages] = useState(
    initial?.images && initial.images.length > 0 ? initial.images : ['']
  );
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const discount = useMemo(() => calcDiscount(regularPrice, salePrice), [regularPrice, salePrice]);

  function updateImage(index, value) {
    const next = [...images];
    next[index] = value;
    setImages(next);
  }

  function addImageField() {
    setImages([...images, '']);
  }

  function removeImageField(index) {
    setImages(images.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return setError('Title zaroori hai');
    if (!categoryId) return setError('Category select karein');
    if (!affiliateUrl.trim()) return setError('Affiliate URL zaroori hai');

    setSaving(true);
    setError('');
    try {
      await onSubmit({
        title,
        categoryId,
        brandId,
        regularPrice: Number(regularPrice) || 0,
        salePrice: Number(salePrice) || 0,
        shortDescription,
        affiliateUrl,
        images: images.filter((u) => u.trim()),
        seoTitle,
        seoDescription
      });
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
        <label className="block text-sm font-medium mb-1">Product title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Wireless Headphones"
          className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
        >
          {categories.length === 0 && <option value="">Pehle ek category banayein</option>}
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Brand (optional)</label>
        <select
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
          className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
        >
          <option value="">No brand</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Regular price</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={regularPrice}
            onChange={(e) => setRegularPrice(e.target.value)}
            className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sale price</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discount</label>
          <div className="w-full border border-line rounded-lg px-3 py-2 bg-paper text-teal font-semibold">
            {discount}%
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Short description</label>
        <textarea
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          rows={3}
          placeholder="1-2 lines about the product"
          className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Affiliate URL</label>
        <input
          type="url"
          value={affiliateUrl}
          onChange={(e) => setAffiliateUrl(e.target.value)}
          placeholder="https://..."
          className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Image URLs</label>
        <div className="space-y-2">
          {images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="url"
                value={img}
                onChange={(e) => updateImage(i, e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 border border-line rounded-lg px-3 py-2 focus-ring outline-none"
              />
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(i)}
                  className="px-3 text-red-500 hover:underline text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addImageField}
          className="mt-2 text-teal text-sm hover:underline"
        >
          + Add another image
        </button>
        <p className="text-xs text-muted mt-1">
          Image ka URL paste karein (upload nahi) — jaise product ki official ya CDN link.
        </p>
      </div>

      <div className="border-t border-line pt-4">
        <p className="text-sm font-semibold mb-3">SEO (search engines ke liye)</p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">SEO title</label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="Khaali chodne par product title use hoga"
            className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">SEO meta description</label>
          <textarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            rows={2}
            placeholder="Khaali chodne par short description use hogi"
            className="w-full border border-line rounded-lg px-3 py-2 focus-ring outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving || categories.length === 0}
        className="bg-mango text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-orange-500 transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
