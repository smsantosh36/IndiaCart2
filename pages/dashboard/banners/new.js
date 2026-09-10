import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/DashboardLayout';
import BannerForm from '../../../components/BannerForm';

export default function NewBanner() {
  const router = useRouter();

  async function handleSubmit(data) {
    const res = await fetch('/api/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Save nahi hua');
    }
    router.push('/dashboard/banners');
  }

  return (
    <DashboardLayout title="Add banner">
      <BannerForm onSubmit={handleSubmit} submitLabel="Add banner" />
    </DashboardLayout>
  );
}
