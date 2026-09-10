import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BannerCard from '../../components/BannerCard';
import SeoHead from '../../components/SeoHead';
import { readDB } from '../../lib/db';

export async function getStaticProps() {
  const db = await readDB();

  if (!db.settings.showBanners) {
    return { notFound: true, revalidate: 30 };
  }

  const banners = [...db.banners].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  return { props: { banners }, revalidate: 30 };
}

export default function BannersPage({ banners }) {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <SeoHead title="Advertisement" description="Sponsored banners." path="/banners" />
      <Navbar />
      <main className="max-w-6xl mx-auto px-5 py-10 flex-1 w-full">
        <Link href="/" className="text-sm text-teal hover:underline">
          ← Home
        </Link>
        <h1 className="font-display text-3xl font-medium mt-4 mb-8">Advertisement</h1>

        {banners.length === 0 && (
          <div className="border border-dashed border-line rounded-2xl p-10 text-center text-muted">
            Koi banner nahi hai.
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {banners.map((banner) => (
            <BannerCard key={banner.id} banner={banner} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
