import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import SeoHead from '../../components/SeoHead';
import { readDB, writeDB } from '../../lib/db';

const PAGE_SIZE = 10;

export async function getServerSideProps({ params }) {
  const db = await readDB();
  const index = db.categories.findIndex((c) => c.slug === params.slug);

  if (index === -1) {
    return { notFound: true };
  }

  // View count server-side hi badha dete hain — write ko await nahi karte taake
  // page render Redis write ke poora hone ka intezaar na kare (fast response)
  db.categories[index].viewCount = (db.categories[index].viewCount || 0) + 1;
  writeDB(db).catch(() => {});

  const category = db.categories[index];
  const products = db.products.filter((p) => p.categoryId === category.id);

  return { props: { category, products } };
}

export default function CategoryPage({ category, products }) {
  const seoTitle = category.seoTitle || category.title;
  const seoDescription = category.seoDescription || category.description || '';

  // Poore products SSR se hi mil chuke hain (SEO ke liye) — sirf display
  // progressively 10-10 karke reveal karte hain jab user scroll kare.
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    if (!loaderRef.current || visibleCount >= products.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoadingMore(true);
          // Thoda delay taake loader nazar aaye (real network jaisa feel)
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, products.length));
            setLoadingMore(false);
          }, 400);
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [visibleCount, products.length]);

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        image={category.image}
        path={`/category/${category.slug}`}
      />
      <Navbar />
      <main className="max-w-6xl mx-auto px-5 py-10 flex-1 w-full">
        <Link href="/" className="text-sm text-teal hover:underline">
          ← All categories
        </Link>

        <h1 className="font-display text-3xl font-medium mt-4 mb-1">{category.title}</h1>
        {category.description && (
          <p className="text-muted max-w-2xl mb-3">{category.description}</p>
        )}
        <p className="text-muted mb-8">{products.length} products</p>

        {products.length === 0 ? (
          <div className="border border-dashed border-line rounded-2xl p-10 text-center text-muted">
            Is category mein abhi koi product nahi hai.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {visibleProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {visibleCount < products.length && (
              <div ref={loaderRef} className="flex justify-center py-10">
                <div className="flex items-center gap-2 text-muted text-sm">
                  <span className="w-4 h-4 border-2 border-teal border-t-transparent rounded-full animate-spin" />
                  Loading more...
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
