import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BrandCard from '../../components/BrandCard';
import SeoHead from '../../components/SeoHead';
import { readDB } from '../../lib/db';

export async function getStaticProps() {
  const db = await readDB();
  const brands = [...db.brands].sort((a, b) => a.name.localeCompare(b.name));
  return { props: { brands }, revalidate: 30 };
}

export default function BrandsPage({ brands }) {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <SeoHead title="Brands" description="Browse all brands." path="/brands" />
      <Navbar />
      <main className="max-w-6xl mx-auto px-5 py-10 flex-1 w-full">
        <Link href="/" className="text-sm text-teal hover:underline">
          ← Home
        </Link>
        <h1 className="font-display text-3xl font-medium mt-4 mb-8">Brands</h1>

        {brands.length === 0 && (
          <div className="border border-dashed border-line rounded-2xl p-10 text-center text-muted">
            Koi brand nahi hai.
          </div>
        )}

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
