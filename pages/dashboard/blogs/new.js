import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/DashboardLayout';
import BlogForm from '../../../components/BlogForm';

export default function NewBlog() {
  const router = useRouter();

  async function handleSubmit(data) {
    const res = await fetch('/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Save nahi hua');
    }
    router.push('/dashboard/blogs');
  }

  return (
    <DashboardLayout title="Add blog post">
      <BlogForm onSubmit={handleSubmit} submitLabel="Publish post" />
    </DashboardLayout>
  );
}
