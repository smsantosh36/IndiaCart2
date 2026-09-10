import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/DashboardLayout';
import PageForm from '../../../components/PageForm';

export default function NewPage() {
  const router = useRouter();

  async function handleSubmit(data) {
    const res = await fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Save nahi hua');
    }
    router.push('/dashboard/pages');
  }

  return (
    <DashboardLayout title="Add page">
      <PageForm onSubmit={handleSubmit} submitLabel="Create page" />
    </DashboardLayout>
  );
}
