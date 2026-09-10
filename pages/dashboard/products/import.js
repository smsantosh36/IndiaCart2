import { useState } from 'react';
import { useRouter } from 'next/router';
import Papa from 'papaparse';
import DashboardLayout from '../../../components/DashboardLayout';

export default function ImportProducts() {
  const router = useRouter();
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [importing, setImporting] = useState(false);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setError('');
    setResult(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (parsed) => setRows(parsed.data),
      error: (err) => setError(err.message)
    });
  }

  async function handleImport() {
    if (rows.length === 0) {
      setError('Pehle ek CSV file select karein');
      return;
    }
    setImporting(true);
    setError('');
    try {
      const res = await fetch('/api/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: rows })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Import fail ho gaya');
      setResult(data);
      setRows([]);
      setFileName('');
    } catch (err) {
      setError(err.message);
    } finally {
      setImporting(false);
    }
  }

  return (
    <DashboardLayout title="Import products">
      <div className="bg-white border border-line rounded-2xl p-6 max-w-2xl space-y-5">
        <div>
          <p className="text-sm font-medium mb-2">CSV file select karein</p>
          <input type="file" accept=".csv" onChange={handleFile} className="text-sm" />
          {fileName && (
            <p className="text-xs text-muted mt-1">
              {fileName} — {rows.length} rows mile
            </p>
          )}
        </div>

        <div className="bg-paper border border-line rounded-lg p-4 text-xs text-muted">
          <p className="font-medium mb-1">CSV format (pehli row header honi chahiye):</p>
          <code className="block whitespace-pre-wrap break-all bg-white border border-line rounded p-2 mt-1">
            title,category,regularPrice,salePrice,shortDescription,affiliateUrl,images,seoTitle,seoDescription
          </code>
          <p className="mt-2">
            <strong>images</strong> column mein multiple URLs ko <strong>|</strong> (pipe) se
            separate karein. Agar <strong>category</strong> pehle se nahi hai, to wo apne aap
            ban jaayegi.
          </p>
          <a href="/api/products/export" className="text-teal hover:underline inline-block mt-2">
            Sample ke liye existing products CSV download karein →
          </a>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {result && (
          <div className="text-sm border border-line rounded-lg p-4">
            <p className="text-teal font-medium">{result.created} products import ho gaye ✅</p>
            {result.errors.length > 0 && (
              <div className="mt-2 text-red-500">
                <p className="font-medium">{result.errors.length} rows skip hui:</p>
                <ul className="list-disc pl-5">
                  {result.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4 items-center">
          <button
            onClick={handleImport}
            disabled={importing || rows.length === 0}
            className="bg-mango text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-orange-500 transition-colors disabled:opacity-50"
          >
            {importing ? 'Importing...' : `Import ${rows.length || ''} products`}
          </button>
          <button
            onClick={() => router.push('/dashboard/products')}
            type="button"
            className="text-sm text-muted hover:underline"
          >
            Back to products
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
