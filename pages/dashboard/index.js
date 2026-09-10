import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../components/DashboardLayout';

export default function DashboardHome() {
  const [counts, setCounts] = useState({
    categories: 0,
    products: 0,
    totalViews: 0,
    totalClicks: 0,
    totalLikes: 0,
    totalFollowClicks: 0
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/videos').then((r) => r.json())
    ]).then(([cats, prods, videos]) => {
      const categoryViews = cats.reduce((sum, c) => sum + (c.viewCount || 0), 0);
      const productViews = prods.reduce((sum, p) => sum + (p.viewCount || 0), 0);
      const totalClicks = prods.reduce((sum, p) => sum + (p.clickCount || 0), 0);
      const totalLikes = videos.reduce((sum, v) => sum + (v.likeCount || 0), 0);
      const totalFollowClicks = videos.reduce((sum, v) => sum + (v.followClickCount || 0), 0);

      setCounts({
        categories: cats.length,
        products: prods.length,
        totalViews: categoryViews + productViews,
        totalClicks,
        totalLikes,
        totalFollowClicks
      });
    });
  }, []);

  return (
    <DashboardLayout title="Overview">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Link
          href="/dashboard/categories"
          className="bg-white border border-line rounded-2xl p-6 hover:shadow-lg transition-shadow"
        >
          <p className="text-muted text-sm mb-1">Categories</p>
          <p className="font-display text-4xl font-medium">{counts.categories}</p>
          <p className="text-teal text-sm mt-3">Manage categories →</p>
        </Link>
        <Link
          href="/dashboard/products"
          className="bg-white border border-line rounded-2xl p-6 hover:shadow-lg transition-shadow"
        >
          <p className="text-muted text-sm mb-1">Products</p>
          <p className="font-display text-4xl font-medium">{counts.products}</p>
          <p className="text-teal text-sm mt-3">Manage products →</p>
        </Link>
        <Link
          href="/dashboard/videos"
          className="bg-white border border-line rounded-2xl p-6 hover:shadow-lg transition-shadow"
        >
          <p className="text-muted text-sm mb-1">Video likes / follow clicks</p>
          <p className="font-display text-4xl font-medium">
            {counts.totalLikes} <span className="text-lg text-muted">/</span> {counts.totalFollowClicks}
          </p>
          <p className="text-teal text-sm mt-3">Manage videos →</p>
        </Link>
        <div className="bg-white border border-line rounded-2xl p-6">
          <p className="text-muted text-sm mb-1">Total views</p>
          <p className="font-display text-4xl font-medium">{counts.totalViews}</p>
          <p className="text-xs text-muted mt-3">Category + product page views</p>
        </div>
        <div className="bg-white border border-line rounded-2xl p-6">
          <p className="text-muted text-sm mb-1">Total affiliate clicks</p>
          <p className="font-display text-4xl font-medium">{counts.totalClicks}</p>
          <p className="text-xs text-muted mt-3">"Buy now" button clicks</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
