import { useRef } from 'react';
import Link from 'next/link';
import VideoCard from './VideoCard';

export default function VideoSection({ videos }) {
  const scrollRef = useRef(null);

  function scroll(direction) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: 'smooth' });
  }

  if (!videos || videos.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl font-medium">Videos</h2>
        <Link
          href="/videos"
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
          mobile: 2.5 visible (peek hint ke liye — pata chale scroll ho sakta hai),
          tablet (md): 4 visible, desktop (lg): 8 visible. 9-12 videos hone par
          row apne aap horizontal slider ban jaati hai.
        */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
        >
          {videos.map((video) => (
            <div
              key={video.id}
              className="flex-none snap-start w-[calc((100%-16px)/2.5)] md:w-[calc((100%-48px)/4)] lg:w-[calc((100%-112px)/8)]"
            >
              <VideoCard video={video} />
            </div>
          ))}
        </div>

        {videos.length > 2 && (
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
