import Link from 'next/link';

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group block bg-white rounded-2xl border border-line overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <div className="aspect-[4/3] bg-paper overflow-hidden">
        {category.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={category.image}
            alt={category.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted font-display">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display font-medium text-lg">{category.title}</h3>
      </div>
    </Link>
  );
}
