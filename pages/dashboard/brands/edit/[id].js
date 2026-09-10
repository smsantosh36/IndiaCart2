import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../../components/DashboardLayout';
import BrandForm from '../../../../components/BrandForm';

export default function EditBrand() {
  const router = useRouter();
  const { id } = router.query;
  const [brand, setBrand] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/brands/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setBrand);
  }, [id]);

  async function handleSubmit(data) {
    const res = await fetch(`/api/brands/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Update nahi hua');
    }
    router.push('/dashboard/brands');
  }

  return (
    <DashboardLayout title="Edit brand">
      {brand ? (
        <BrandForm initial={brand} onSubmit={handleSubmit} submitLabel="Save changes" />
      ) : (
        <p className="text-muted">Loading...</p>
      )}
    </DashboardLayout>
  );
}
