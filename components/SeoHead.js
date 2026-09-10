import Head from 'next/head';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || '';
const SITE_NAME = 'DealLoop';

// WhatsApp/Facebook/Threads jaise crawlers sirf real http(s) image URL fetch kar
// sakte hain — base64 (data:) images inline preview mein kaam nahi karti.
function isAbsoluteImageUrl(url) {
  return !!url && /^https?:\/\//i.test(url);
}

function guessImageType(url) {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'gif') return 'image/gif';
  return undefined;
}

export default function SeoHead({ title, description, image, path = '' }) {
  const url = SITE_URL ? `${SITE_URL}${path}` : undefined;
  const ogImage = isAbsoluteImageUrl(image) ? image : undefined;
  const imageType = ogImage ? guessImageType(ogImage) : undefined;

  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}

      {/* Open Graph — WhatsApp, Facebook, Threads share preview ke liye */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
      {url && <meta property="og:url" content={url} />}
      {ogImage && (
        <>
          <meta property="og:image" content={ogImage} />
          <meta property="og:image:secure_url" content={ogImage} />
          {imageType && <meta property="og:image:type" content={imageType} />}
          {/* WhatsApp ke liye width/height dena zaroori hai — inke bina wo kabhi
              kabhi preview image bilkul nahi dikhata, chahe URL sahi ho. */}
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={title} />
        </>
      )}

      {/* Twitter/X Card (Threads bhi isi ko fallback ki tarah use karta hai) */}
      <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Head>
  );
}
