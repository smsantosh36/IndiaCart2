function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// File select hote hi ise base64 mein padh kar /api/upload par bhejta hai.
// Vercel Blob connected ho to real hosted image URL milta hai (fast + WhatsApp/
// Facebook preview ke liye zaroori), warna local dev mein base64 hi wapas aata hai.
export async function uploadImageFile(file, filename) {
  const dataUri = await fileToBase64(file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataUri, filename })
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Image upload fail ho gaya');
  }

  const data = await res.json();
  return data.url;
}
