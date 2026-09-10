import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import SeoHead from '../../components/SeoHead';
import { readDB } from '../../lib/db';

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const db = await readDB();
  const brand = db.brands.find((b) => b.slug === params.slug);

  if (!brand) {
    return { notFound: true, revalidate: 30 };
  }

  const products = db.products.filter((p) => p.brandId === brand.id);

  return { props: { brand, products }, revalidate: 30 };
}

export default function BrandPage({ brand, products }) {
  const seoTitle = brand.seoTitle || brand.name;
  const seoDescription = brand.seoDescription || brand.description || '';

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        image={brand.logo}
        path={`/b/${brand.slug}`}
      />
      <Navbar />
      <main className="max-w-6xl mx-auto px-5 py-10 flex-1 w-full">
        <Link href="/brands" className="text-sm text-teal hover:underline">
          ← All brands
        </Link>

        <div className="flex items-center gap-5 mt-6 mb-2">
          <div className="w-20 h-20 rounded-full bg-white border border-line flex items-center justify-center p-3 shrink-0">
            {brand.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
            ) : (
              <span className="font-display text-2xl text-muted">{brand.name?.[0] || '?'}</span>
            )}
          </div>
          <h1 className="font-display text-3xl font-medium">{brand.name}</h1>
        </div>

        {brand.description && (
          <p className="text-muted max-w-2xl mb-3">{brand.description}</p>
        )}
        <p className="text-muted mb-8">{products.length} products</p>

        {products.length === 0 ? (
          <div className="border border-dashed border-line rounded-2xl p-10 text-center text-muted">
            Is brand ke abhi koi products nahi hain.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
