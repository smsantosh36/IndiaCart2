import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import ShareButtons from '../../components/ShareButtons';
import { readDB, writeDB } from '../../lib/db';

export async function getServerSideProps({ params }) {
  const db = await readDB();
  const index = db.products.findIndex((p) => p.slug === params.slug);

  if (index === -1) {
    return { notFound: true };
  }

  // View count server-side hi badha dete hain — write ko await nahi karte taake
  // page render Redis write ke poora hone ka intezaar na kare (fast response)
  db.products[index].viewCount = (db.products[index].viewCount || 0) + 1;
  writeDB(db).catch(() => {});

  return { props: { product: db.products[index] } };
}

export default function ProductPage({ product }) {
  const [activeImage, setActiveImage] = useState(0);

  function handleBuyNowClick() {
    // Affiliate click track karo — link ko block kiye bina
    fetch(`/api/products/${product.id}/click`, { method: 'POST' }).catch(() => {});
  }

  const images = product.images && product.images.length > 0 ? product.images : [];
  const seoTitle = product.seoTitle || product.title;
  const seoDescription = product.seoDescription || product.shortDescription || '';

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        image={images[0]}
        path={`/pd/${product.slug}`}
      />
      <Navbar />
      <main className="max-w-5xl mx-auto px-5 py-10 flex-1 w-full">
        <Link href="/" className="text-sm text-teal hover:underline">
          ← Back
        </Link>

        <div className="grid md:grid-cols-2 gap-10 mt-6">
          <div>
            <div className="aspect-square bg-white rounded-2xl border border-line overflow-hidden">
              {images.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={images[activeImage]}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted">
                  No image
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-lg border-2 overflow-hidden shrink-0 focus-ring ${
                      activeImage === i ? 'border-mango' : 'border-line'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="font-display text-2xl font-medium mb-3">{product.title}</h1>

            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-semibold">₹{product.salePrice}</span>
              {product.regularPrice > product.salePrice && (
                <span className="text-lg text-muted line-through">
                  ₹{product.regularPrice}
                </span>
              )}
              {product.discountPercent > 0 && (
                <span className="price-tag text-xs">{product.discountPercent}% OFF</span>
              )}
            </div>

            {product.shortDescription && (
              <p className="text-muted leading-relaxed mt-4">{product.shortDescription}</p>
            )}

            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="nofollow sponsored noopener"
              onClick={handleBuyNowClick}
              className="mt-8 inline-block bg-mango text-white font-medium px-8 py-3 rounded-full hover:bg-orange-500 transition-colors"
            >
              Buy now
            </a>
            <p className="text-xs text-muted mt-3">
              Ye ek affiliate link hai — is se purchase karne par hume commission mil sakta hai.
            </p>
          </div>
        </div>

        <ShareButtons title={product.title} priceText={`₹${product.salePrice}`} />
      </main>
      <Footer />
    </div>
  );
}
