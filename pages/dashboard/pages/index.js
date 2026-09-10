import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../components/DashboardLayout';

export default function PagesList() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch('/api/pages')
      .then((r) => r.json())
      .then((data) => {
        setPages(data);
        setLoading(false);
      });
  }

  useEffect(load, []);

  async function handleDelete(id) {
    if (!confirm('Ye page delete karein?')) return;
    await fetch(`/api/pages/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <DashboardLayout
      title="Pages"
      action={
        <Link
          href="/dashboard/pages/new"
          className="bg-mango text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-500 transition-colors"
        >
          + Add page
        </Link>
      }
    >
      {loading && <p className="text-muted">Loading...</p>}

      {!loading && pages.length === 0 && (
        <div className="border border-dashed border-line rounded-2xl p-10 text-center text-muted">
          Koi custom page nahi hai (jaise About, Contact). "+ Add page" se banayein.
        </div>
      )}

      {!loading && pages.length > 0 && (
        <div className="bg-white border border-line rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-paper text-left text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">URL</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-muted">/{p.slug}</td>
                  <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                    <Link href={`/${p.slug}`} target="_blank" className="text-teal hover:underline">
                      View
                    </Link>
                    <Link href={`/dashboard/pages/edit/${p.id}`} className="text-teal hover:underline">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">
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
