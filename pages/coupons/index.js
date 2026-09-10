import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CouponCard from '../../components/CouponCard';
import SeoHead from '../../components/SeoHead';
import { readDB } from '../../lib/db';

export async function getStaticProps() {
  const db = await readDB();
  const coupons = [...db.coupons].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  return { props: { coupons }, revalidate: 30 };
}

export default function CouponsPage({ coupons }) {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <SeoHead
        title="Coupons — All offers"
        description="Latest coupon codes and discounts."
        path="/coupons"
      />
      <Navbar />
      <main className="max-w-6xl mx-auto px-5 py-10 flex-1 w-full">
        <Link href="/" className="text-sm text-teal hover:underline">
          ← Home
        </Link>
        <h1 className="font-display text-3xl font-medium mt-4 mb-8">Coupons</h1>

        {coupons.length === 0 && (
          <div className="border border-dashed border-line rounded-2xl p-10 text-center text-muted">
            Koi coupon nahi hai.
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
