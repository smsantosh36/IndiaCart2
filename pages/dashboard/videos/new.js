import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/DashboardLayout';
import VideoForm from '../../../components/VideoForm';

export default function NewVideo() {
  const router = useRouter();

  async function handleSubmit(data) {
    const res = await fetch('/api/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Save nahi hua');
    }
    router.push('/dashboard/videos');
  }

  return (
    <DashboardLayout title="Add video">
      <VideoForm onSubmit={handleSubmit} submitLabel="Add video" />
    </DashboardLayout>
  );
}
