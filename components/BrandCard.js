import Link from 'next/link';

export default function BrandCard({ brand }) {
  return (
    <Link
      href={`/b/${brand.slug}`}
      className="group flex flex-col items-center text-center gap-2"
    >
      <div className="w-20 h-20 rounded-full bg-white border border-line flex items-center justify-center p-3 group-hover:shadow-md transition-shadow">
        {brand.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
        ) : (
          <span className="font-display text-lg text-muted">{brand.name?.[0] || '?'}</span>
        )}
      </div>
      <p className="text-sm font-medium truncate w-full">{brand.name}</p>
    </Link>
  );
}
