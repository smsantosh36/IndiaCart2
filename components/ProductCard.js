import Link from 'next/link';

export default function ProductCard({ product }) {
  const cover = product.images && product.images.length > 0 ? product.images[0] : null;

  // Box (image/title/price) par click -> seedha affiliate link naye tab me khule.
  function handleBoxClick() {
    if (!product.affiliateUrl) return;
    fetch(`/api/products/${product.id}/click`, { method: 'POST' }).catch(() => {});
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
  }

  function handleBoxKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleBoxClick();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleBoxClick}
      onKeyDown={handleBoxKeyDown}
      className="group block bg-white rounded-2xl border border-line overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
    >
      <div className="relative aspect-square bg-paper overflow-hidden">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted font-display text-sm">
            No image
          </div>
        )}
        {product.discountPercent > 0 && (
          <span className="price-tag absolute top-3 left-0 text-xs">
            {product.discountPercent}% OFF
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display font-medium leading-snug line-clamp-2 min-h-[2.6em]">
          {product.title}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-ink">₹{product.salePrice}</span>
          {product.regularPrice > product.salePrice && (
            <span className="text-sm text-muted line-through">₹{product.regularPrice}</span>
          )}
        </div>

        {/* View Product -> internal product page (/pd/slug). Box click event tak na pahoche. */}
        <Link
          href={`/pd/${product.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="mt-3 block text-center bg-mango text-white text-sm font-medium py-2 rounded-full hover:bg-orange-500 transition-colors"
        >
          View Product
        </Link>
      </div>
    </div>
  );
}
