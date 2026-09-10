import Link from 'next/link';

export default function BlogCard({ blog }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group block bg-white rounded-2xl border border-line overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <div className="aspect-video bg-paper overflow-hidden">
        {blog.featuredImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted font-display text-sm">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display font-medium leading-snug line-clamp-2">{blog.title}</h3>
      </div>
    </Link>
  );
}
