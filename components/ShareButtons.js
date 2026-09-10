import { useEffect, useState } from 'react';

export default function ShareButtons({ title, priceText }) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  if (!url) return null;

  const shareText = priceText ? `${title} — ${priceText}` : title;
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard access na mile to bhi silently ignore karo
    }
  }

  const links = [
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.42a9.87 9.87 0 004.62 1.18h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2zm5.86 14.07c-.25.7-1.45 1.34-2 1.43-.51.08-1.15.11-1.86-.12-.43-.14-.98-.32-1.68-.63-2.96-1.28-4.89-4.25-5.04-4.45-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.25.6.85 2.08.92 2.23.07.15.12.33.02.53-.1.2-.15.32-.3.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.36 1.45.3.15.48.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.28.1 1.75.82 2.05.97.3.15.5.22.57.35.08.13.08.75-.17 1.45z" />
        </svg>
      )
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
        </svg>
      )
    },
    {
      name: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M18.9 2H22l-7.2 8.24L23.3 22h-6.62l-5.18-6.77L5.5 22H2.37l7.7-8.8L1 2h6.78l4.68 6.2L18.9 2zm-1.16 18h1.84L7.4 3.9H5.44L17.74 20z" />
        </svg>
      )
    }
  ];

  return (
    <div className="mt-10 pt-6 border-t border-line">
      <p className="text-sm font-medium mb-3">Share this product</p>
      <div className="flex items-center gap-3">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${link.name}`}
            className="w-10 h-10 rounded-full bg-paper border border-line flex items-center justify-center text-ink hover:bg-white hover:shadow-md transition-all"
          >
            {link.icon}
          </a>
        ))}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy link"
          className="h-10 px-4 rounded-full bg-paper border border-line flex items-center gap-2 text-sm text-ink hover:bg-white hover:shadow-md transition-all"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1.5 1.5" strokeLinecap="round" />
            <path d="M14 11a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07l1.5-1.5" strokeLinecap="round" />
          </svg>
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>
    </div>
  );
}
