import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/DashboardLayout';
import CouponForm from '../../../components/CouponForm';

export default function NewCoupon() {
  const router = useRouter();

  async function handleSubmit(data) {
    const res = await fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Save nahi hua');
    }
    router.push('/dashboard/coupons');
  }

  return (
    <DashboardLayout title="Add coupon">
      <CouponForm onSubmit={handleSubmit} submitLabel="Create coupon" />
    </DashboardLayout>
  );
}
