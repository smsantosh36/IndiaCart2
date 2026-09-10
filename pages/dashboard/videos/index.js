import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../components/DashboardLayout';

export default function VideosList() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch('/api/videos')
      .then((r) => r.json())
      .then((data) => {
        setVideos(data);
        setLoading(false);
      });
  }

  useEffect(load, []);

  async function handleDelete(id) {
    if (!confirm('Ye video delete karein?')) return;
    await fetch(`/api/videos/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <DashboardLayout
      title="Videos"
      action={
        <Link
          href="/dashboard/videos/new"
          className="bg-mango text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-500 transition-colors"
        >
          + Add video
        </Link>
      }
    >
      {loading && <p className="text-muted">Loading...</p>}

      {!loading && videos.length === 0 && (
        <div className="border border-dashed border-line rounded-2xl p-10 text-center text-muted">
          Koi video nahi hai. "+ Add video" se shuru karein.
        </div>
      )}

      {!loading && videos.length > 0 && (
        <div className="bg-white border border-line rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-paper text-left text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Platform</th>
                <th className="px-4 py-3 font-medium">Caption</th>
                <th className="px-4 py-3 font-medium">Likes</th>
                <th className="px-4 py-3 font-medium">Follow clicks</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {videos.map((v) => (
                <tr key={v.id} className="border-t border-line">
                  <td className="px-4 py-3 capitalize">{v.platform}</td>
                  <td className="px-4 py-3 text-muted max-w-xs truncate">{v.caption || '—'}</td>
                  <td className="px-4 py-3">{v.likeCount || 0}</td>
                  <td className="px-4 py-3 font-medium text-teal">{v.followClickCount || 0}</td>
                  <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                    <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">
                      View
                    </a>
                    <Link href={`/dashboard/videos/edit/${v.id}`} className="text-teal hover:underline">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(v.id)} className="text-red-500 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
