import { useState } from 'react';

export default function CouponCard({ coupon }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleReveal() {
    setRevealed(true);
    if (coupon.affiliateUrl) {
      window.open(coupon.affiliateUrl, '_blank', 'noopener');
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard access na mile to bhi silently ignore karo
    }
  }

  return (
    <div className="bg-white border border-line rounded-2xl p-5 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-paper border border-line overflow-hidden flex items-center justify-center mb-3">
        {coupon.brandLogo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coupon.brandLogo}
            alt={coupon.brandName}
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <span className="font-display text-lg text-muted">
            {coupon.brandName?.[0] || '?'}
          </span>
        )}
      </div>

      <p className="font-display font-medium">{coupon.brandName}</p>
      <p className="text-teal text-sm font-medium mb-4">{coupon.discountText}</p>

      {!revealed ? (
        <button
          type="button"
          onClick={handleReveal}
          className="w-full border-2 border-dashed border-mango text-mango font-medium text-sm px-4 py-2 rounded-full hover:bg-mango hover:text-white transition-colors"
        >
          Show code
        </button>
      ) : (
        <div className="w-full flex items-center gap-2">
          <span className="flex-1 border border-dashed border-line rounded-full px-3 py-2 text-sm font-mono tracking-wider bg-paper truncate">
            {coupon.code}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 bg-mango text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-orange-500 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
}
