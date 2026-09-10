import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/DashboardLayout';
import ProductForm from '../../../components/ProductForm';

export default function NewProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then(setCategories);
    fetch('/api/brands')
      .then((r) => r.json())
      .then(setBrands);
  }, []);

  async function handleSubmit(data) {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Save nahi hua');
    }
    router.push('/dashboard/products');
  }

  return (
    <DashboardLayout title="Add product">
      {categories.length === 0 ? (
        <div className="border border-dashed border-line rounded-2xl p-10 text-center text-muted max-w-lg">
          Product add karne se pehle kam az kam ek category banayein.
        </div>
      ) : (
        <ProductForm
          categories={categories}
          brands={brands}
          onSubmit={handleSubmit}
          submitLabel="Create product"
        />
      )}
    </DashboardLayout>
  );
}
