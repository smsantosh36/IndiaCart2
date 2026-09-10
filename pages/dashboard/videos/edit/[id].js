import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../../components/DashboardLayout';
import VideoForm from '../../../../components/VideoForm';

export default function EditVideo() {
  const router = useRouter();
  const { id } = router.query;
  const [video, setVideo] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/videos/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setVideo);
  }, [id]);

  async function handleSubmit(data) {
    const res = await fetch(`/api/videos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Update nahi hua');
    }
    router.push('/dashboard/videos');
  }

  return (
    <DashboardLayout title="Edit video">
      {video ? (
        <VideoForm initial={video} onSubmit={handleSubmit} submitLabel="Save changes" />
      ) : (
        <p className="text-muted">Loading...</p>
      )}
    </DashboardLayout>
  );
}
