import { useRef } from 'react';
import CategoryCard from './CategoryCard';

export default function CategoryGridSlider({ categories }) {
  const scrollRef = useRef(null);

  function scroll(direction) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: 'smooth' });
  }

  return (
    <div className="relative group mb-14">
      {/*
        Card width = default visible count ke hisaab se calc() ki gayi hai:
        mobile: 2.5 visible (peek hint ke liye), tablet (md): 6 visible, desktop (lg): 8 visible.
        Categories is count se zyada hon to row overflow karke khud slider ban
        jaati hai — warna normal static grid row jaisa dikhti hai.
      */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
      >
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex-none snap-start w-[calc((100%-20px)/2.5)] md:w-[calc((100%-100px)/6)] lg:w-[calc((100%-140px)/8)]"
          >
            <CategoryCard category={cat} />
          </div>
        ))}
      </div>

      {categories.length > 2 && (
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
  );
}
