import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import { readDB } from '../../lib/db';

export async function getServerSideProps({ params }) {
  const db = await readDB();
  const blog = db.blogs.find((b) => b.slug === params.slug);

  if (!blog) {
    return { notFound: true };
  }

  return { props: { blog } };
}

export default function BlogPost({ blog }) {
  const seoTitle = blog.seoTitle || blog.title;
  const seoDescription = blog.seoDescription || '';

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        image={blog.featuredImage}
        path={`/blog/${blog.slug}`}
      />
      <Navbar />
      <main className="max-w-3xl mx-auto px-5 py-10 flex-1 w-full">
        <Link href="/blog" className="text-sm text-teal hover:underline">
          ← All posts
        </Link>

        <article className="mt-6">
          {blog.featuredImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full aspect-video object-cover rounded-2xl border border-line mb-6"
            />
          )}
          <h1 className="font-display text-3xl font-medium mb-6">{blog.title}</h1>
          <div className="rich-content" dangerouslySetInnerHTML={{ __html: blog.content }} />
        </article>
      </main>
      <Footer />
    </div>
  );
}
