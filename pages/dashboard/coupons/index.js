import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../components/DashboardLayout';

export default function CouponsList() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch('/api/coupons')
      .then((r) => r.json())
      .then((data) => {
        setCoupons(data);
        setLoading(false);
      });
  }

  useEffect(load, []);

  async function handleDelete(id) {
    if (!confirm('Ye coupon delete karein?')) return;
    await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <DashboardLayout
      title="Coupons"
      action={
        <Link
          href="/dashboard/coupons/new"
          className="bg-mango text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-500 transition-colors"
        >
          + Add coupon
        </Link>
      }
    >
      {loading && <p className="text-muted">Loading...</p>}

      {!loading && coupons.length === 0 && (
        <div className="border border-dashed border-line rounded-2xl p-10 text-center text-muted">
          Koi coupon nahi hai. "+ Add coupon" se shuru karein.
        </div>
      )}

      {!loading && coupons.length > 0 && (
        <div className="bg-white border border-line rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-paper text-left text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Brand</th>
                <th className="px-4 py-3 font-medium">Discount</th>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-paper border border-line overflow-hidden flex items-center justify-center shrink-0">
                      {c.brandLogo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.brandLogo} alt={c.brandName} className="w-full h-full object-contain p-1" />
                      ) : (
                        <span className="text-xs text-muted">{c.brandName?.[0]}</span>
                      )}
                    </div>
                    {c.brandName}
                  </td>
                  <td className="px-4 py-3 text-teal font-medium">{c.discountText}</td>
                  <td className="px-4 py-3 font-mono text-xs">{c.code}</td>
                  <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                    <Link href={`/dashboard/coupons/edit/${c.id}`} className="text-teal hover:underline">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline">
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
