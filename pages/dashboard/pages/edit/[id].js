import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../../components/DashboardLayout';
import PageForm from '../../../../components/PageForm';

export default function EditPage() {
  const router = useRouter();
  const { id } = router.query;
  const [page, setPage] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/pages/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setPage);
  }, [id]);

  async function handleSubmit(data) {
    const res = await fetch(`/api/pages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Update nahi hua');
    }
    router.push('/dashboard/pages');
  }

  return (
    <DashboardLayout title="Edit page">
      {page ? (
        <PageForm initial={page} onSubmit={handleSubmit} submitLabel="Save changes" />
      ) : (
        <p className="text-muted">Loading...</p>
      )}
    </DashboardLayout>
  );
}
