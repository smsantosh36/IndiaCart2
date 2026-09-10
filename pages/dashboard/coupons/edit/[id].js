import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../../components/DashboardLayout';
import CouponForm from '../../../../components/CouponForm';

export default function EditCoupon() {
  const router = useRouter();
  const { id } = router.query;
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/coupons/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setCoupon);
  }, [id]);

  async function handleSubmit(data) {
    const res = await fetch(`/api/coupons/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Update nahi hua');
    }
    router.push('/dashboard/coupons');
  }

  return (
    <DashboardLayout title="Edit coupon">
      {coupon ? (
        <CouponForm initial={coupon} onSubmit={handleSubmit} submitLabel="Save changes" />
      ) : (
        <p className="text-muted">Loading...</p>
      )}
    </DashboardLayout>
  );
}
