import Link from 'next/link';
import CouponCard from './CouponCard';

export default function CouponSection({ coupons }) {
  const latest = coupons.slice(0, 4);
  if (latest.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl font-medium">Coupons</h2>
        <Link
          href="/coupons"
          className="flex items-center gap-1 text-teal text-sm font-medium hover:underline shrink-0"
        >
          View all
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {latest.map((coupon) => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))}
      </div>
    </section>
  );
}
