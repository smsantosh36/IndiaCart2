import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import { readDB } from '../lib/db';

export async function getServerSideProps({ params }) {
  const db = await readDB();
  const page = db.pages.find((p) => p.slug === params.slug);

  if (!page) {
    return { notFound: true };
  }

  return { props: { page } };
}

export default function CustomPage({ page }) {
  const seoTitle = page.seoTitle || page.title;
  const seoDescription = page.seoDescription || '';

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <SeoHead title={seoTitle} description={seoDescription} path={`/${page.slug}`} />
      <Navbar />
      <main className="max-w-3xl mx-auto px-5 py-10 flex-1 w-full">
        <Link href="/" className="text-sm text-teal hover:underline">
          ← Home
        </Link>
        <h1 className="font-display text-3xl font-medium mt-4 mb-6">{page.title}</h1>
        <div className="whitespace-pre-line leading-relaxed text-ink">{page.content}</div>
      </main>
      <Footer />
    </div>
  );
}
