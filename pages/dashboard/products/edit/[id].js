import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../../components/DashboardLayout';
import ProductForm from '../../../../components/ProductForm';

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/products/${id}`).then((r) => (r.ok ? r.json() : null)),
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/brands').then((r) => r.json())
    ]).then(([prod, cats, brandList]) => {
      setProduct(prod);
      setCategories(cats);
      setBrands(brandList);
    });
  }, [id]);

  async function handleSubmit(data) {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Update nahi hua');
    }
    router.push('/dashboard/products');
  }

  return (
    <DashboardLayout title="Edit product">
      {product && categories.length > 0 ? (
        <ProductForm
          initial={product}
          categories={categories}
          brands={brands}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      ) : (
        <p className="text-muted">Loading...</p>
      )}
    </DashboardLayout>
  );
}
