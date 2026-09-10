import { useRef } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';

export default function CategoryProductRow({ category, products }) {
  const scrollRef = useRef(null);

  function scroll(direction) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: 'smooth' });
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl font-medium">{category.title}</h2>
        <Link
          href={`/category/${category.slug}`}
          className="flex items-center gap-1 text-teal text-sm font-medium hover:underline shrink-0"
        >
          View all
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <div className="relative group">
        {/* 
          Card width = default visible count ke hisaab se calc() ki gayi hai:
          mobile: 2.5 visible (peek hint ke liye), tablet (md): 5 visible, desktop (lg): 7 visible.
          Agar products is count se zyada hain, row overflow karke apne aap
          horizontal slider ban jaata hai — warna normal static row jaisa dikhta hai.
        */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
        >
          {products.map((p) => (
            <div
              key={p.id}
              className="flex-none snap-start w-[calc((100%-16px)/2.5)] md:w-[calc((100%-64px)/5)] lg:w-[calc((100%-96px)/7)]"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        {products.length > 2 && (
          <>
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="hidden md:flex items-center justify-center absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-line shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="hidden md:flex items-center justify-center absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-line shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>
    </section>
  );
}
