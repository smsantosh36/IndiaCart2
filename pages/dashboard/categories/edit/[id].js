import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../../components/DashboardLayout';
import CategoryForm from '../../../../components/CategoryForm';

export default function EditCategory() {
  const router = useRouter();
  const { id } = router.query;
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/categories/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setCategory);
  }, [id]);

  async function handleSubmit(data) {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Update nahi hua');
    }
    router.push('/dashboard/categories');
  }

  return (
    <DashboardLayout title="Edit category">
      {category ? (
        <CategoryForm initial={category} onSubmit={handleSubmit} submitLabel="Save changes" />
      ) : (
        <p className="text-muted">Loading...</p>
      )}
    </DashboardLayout>
  );
}
