import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/DashboardLayout';
import CategoryForm from '../../../components/CategoryForm';

export default function NewCategory() {
  const router = useRouter();

  async function handleSubmit(data) {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Save nahi hua');
    }
    router.push('/dashboard/categories');
  }

  return (
    <DashboardLayout title="Add category">
      <CategoryForm onSubmit={handleSubmit} submitLabel="Create category" />
    </DashboardLayout>
  );
}
