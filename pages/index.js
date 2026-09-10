import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CategoryGridSlider from '../components/CategoryGridSlider';
import CategoryProductRow from '../components/CategoryProductRow';
import CouponSection from '../components/CouponSection';
import BrandSection from '../components/BrandSection';
import VideoSection from '../components/VideoSection';
import BannerSection from '../components/BannerSection';
import BlogSection from '../components/BlogSection';
import SeoHead from '../components/SeoHead';
import { readDB } from '../lib/db';

// Har 2 category ke baad ek "Videos" block, har 3 category ke baad ek "Advertisement" block
const CATEGORIES_PER_VIDEO_BLOCK = 2;
const VIDEOS_PER_BLOCK = 12;
const CATEGORIES_PER_BANNER_BLOCK = 3;
const BANNERS_PER_BLOCK = 8;

// ISR: har request par fresh database fetch karne ki bajaye, page ek baar
// generate hoke cache ho jaata hai aur background mein har 30 second mein
// refresh hota hai — isse homepage load bahut fast ho jaata hai.
export async function getStaticProps() {
  const db = await readDB();
  const blogs = [...db.blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const coupons = [...db.coupons].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const videos = [...db.videos].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const banners = [...db.banners].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const brands = [...db.brands].sort((a, b) => a.name.localeCompare(b.name));

  return {
    props: {
      categories: db.categories,
      products: db.products,
      blogs,
      coupons,
      videos,
      banners,
      brands,
      settings: db.settings
    },
    revalidate: 30
  };
}

export default function Home({ categories, products, blogs, coupons, videos, banners, brands, settings }) {
  // Sirf un categories ke liye row banayein jinme kam se kam 1 product ho
  const categoriesWithProducts = categories
    .map((cat) => ({
      category: cat,
      items: products.filter((p) => p.categoryId === cat.id)
    }))
    .filter((entry) => entry.items.length > 0);

  const seoTitle = settings.siteTitle || 'DealLoop — Best deals across every category';
  const seoDescription =
    settings.siteDescription || 'Browse categories and discover the best deals.';

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        image={settings.logoImage}
        path="/"
      />
      <Navbar />
      <main className="max-w-6xl mx-auto px-5 py-10 flex-1 w-full">
        <h1 className="font-display text-3xl font-medium mb-1">Browse categories</h1>
        <p className="text-muted mb-8">Tap a category to see its best deals.</p>

        {categories.length === 0 && (
          <div className="border border-dashed border-line rounded-2xl p-10 text-center text-muted">
            Koi category abhi tak nahi bani. Dashboard se ek category add karein.
          </div>
        )}

        {categories.length > 0 && <CategoryGridSlider categories={categories} />}

        <CouponSection coupons={coupons} />

        <BrandSection brands={brands} />

        {categoriesWithProducts.map(({ category, items }, index) => {
          const isVideoBlockEnd = (index + 1) % CATEGORIES_PER_VIDEO_BLOCK === 0;
          const videoBlockNumber = Math.floor(index / CATEGORIES_PER_VIDEO_BLOCK);
          const videoBlock = videos.slice(
            videoBlockNumber * VIDEOS_PER_BLOCK,
            videoBlockNumber * VIDEOS_PER_BLOCK + VIDEOS_PER_BLOCK
          );

          const isBannerBlockEnd = (index + 1) % CATEGORIES_PER_BANNER_BLOCK === 0;
          const bannerBlockNumber = Math.floor(index / CATEGORIES_PER_BANNER_BLOCK);
          const bannerBlock = banners.slice(
            bannerBlockNumber * BANNERS_PER_BLOCK,
            bannerBlockNumber * BANNERS_PER_BLOCK + BANNERS_PER_BLOCK
          );

          return (
            <div key={category.id}>
              <CategoryProductRow category={category} products={items} />
              {isVideoBlockEnd && <VideoSection videos={videoBlock} />}
              {isBannerBlockEnd && settings.showBanners && (
                <BannerSection banners={bannerBlock} />
              )}
            </div>
          );
        })}

        <BlogSection blogs={blogs} />
      </main>
      <Footer />
    </div>
  );
}
