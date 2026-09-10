import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import VideoCard from '../../components/VideoCard';
import SeoHead from '../../components/SeoHead';
import { readDB } from '../../lib/db';

export async function getStaticProps() {
  const db = await readDB();
  const videos = [...db.videos].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  return { props: { videos }, revalidate: 30 };
}

export default function VideosPage({ videos }) {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <SeoHead title="Videos" description="Latest videos and reels." path="/videos" />
      <Navbar />
      <main className="max-w-6xl mx-auto px-5 py-10 flex-1 w-full">
        <Link href="/" className="text-sm text-teal hover:underline">
          ← Home
        </Link>
        <h1 className="font-display text-3xl font-medium mt-4 mb-8">Videos</h1>

        {videos.length === 0 && (
          <div className="border border-dashed border-line rounded-2xl p-10 text-center text-muted">
            Koi video nahi hai.
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
