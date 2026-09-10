import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../components/DashboardLayout';

export default function BlogsList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch('/api/blogs')
      .then((r) => r.json())
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      });
  }

  useEffect(load, []);

  async function handleDelete(id) {
    if (!confirm('Ye blog post delete karein?')) return;
    await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <DashboardLayout
      title="Blog"
      action={
        <Link
          href="/dashboard/blogs/new"
          className="bg-mango text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-500 transition-colors"
        >
          + Add blog post
        </Link>
      }
    >
      {loading && <p className="text-muted">Loading...</p>}

      {!loading && blogs.length === 0 && (
        <div className="border border-dashed border-line rounded-2xl p-10 text-center text-muted">
          Koi blog post nahi hai. "+ Add blog post" se shuru karein.
        </div>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white border border-line rounded-2xl overflow-hidden">
            <div className="aspect-video bg-paper">
              {blog.featuredImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted text-sm">
                  No image
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="font-display font-medium line-clamp-2">{blog.title}</p>
              <p className="text-xs text-muted mb-3">/blog/{blog.slug}</p>
              <div className="flex gap-3 text-sm">
                <Link href={`/blog/${blog.slug}`} target="_blank" className="text-teal hover:underline">
                  View
                </Link>
                <Link href={`/dashboard/blogs/edit/${blog.id}`} className="text-teal hover:underline">
                  Edit
                </Link>
                <button onClick={() => handleDelete(blog.id)} className="text-red-500 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
