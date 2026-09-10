import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../../components/DashboardLayout';
import BlogForm from '../../../../components/BlogForm';

export default function EditBlog() {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/blogs/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setBlog);
  }, [id]);

  async function handleSubmit(data) {
    const res = await fetch(`/api/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Update nahi hua');
    }
    router.push('/dashboard/blogs');
  }

  return (
    <DashboardLayout title="Edit blog post">
      {blog ? (
        <BlogForm initial={blog} onSubmit={handleSubmit} submitLabel="Save changes" />
      ) : (
        <p className="text-muted">Loading...</p>
      )}
    </DashboardLayout>
  );
}
