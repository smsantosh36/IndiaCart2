export default function BannerCard({ banner }) {
  const content = (
    <div className="aspect-[16/9] bg-paper rounded-2xl border border-line overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={banner.image}
        alt={banner.title || 'Advertisement'}
        className="w-full h-full object-cover"
      />
    </div>
  );

  if (banner.link) {
    return (
      <a
        href={banner.link}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block hover:opacity-90 transition-opacity"
      >
        {content}
      </a>
    );
  }

  return content;
}
