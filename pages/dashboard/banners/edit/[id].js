import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../../components/DashboardLayout';
import BannerForm from '../../../../components/BannerForm';

export default function EditBanner() {
  const router = useRouter();
  const { id } = router.query;
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/banners/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setBanner);
  }, [id]);

  async function handleSubmit(data) {
    const res = await fetch(`/api/banners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Update nahi hua');
    }
    router.push('/dashboard/banners');
  }

  return (
    <DashboardLayout title="Edit banner">
      {banner ? (
        <BannerForm initial={banner} onSubmit={handleSubmit} submitLabel="Save changes" />
      ) : (
        <p className="text-muted">Loading...</p>
      )}
    </DashboardLayout>
  );
}
