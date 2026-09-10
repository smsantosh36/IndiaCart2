function detectPlatform(url) {
  if (/youtube\.com|youtu\.be/i.test(url)) return 'youtube';
  if (/instagram\.com/i.test(url)) return 'instagram';
  if (/pinterest\.[a-z.]+|pin\.it/i.test(url)) return 'pinterest';
  return 'other';
}

function getYoutubeEmbedUrl(url) {
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/);
  const liveMatch = url.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{6,})/);
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/);

  const id =
    (shortsMatch && shortsMatch[1]) ||
    (liveMatch && liveMatch[1]) ||
    (watchMatch && watchMatch[1]) ||
    (shortMatch && shortMatch[1]) ||
    (embedMatch && embedMatch[1]) ||
    '';

  return id ? `https://www.youtube.com/embed/${id}` : null;
}

// Video URL se platform aur (sirf YouTube ke liye) embeddable iframe URL nikalta hai.
// YouTube raw iframe embedding allow karta hai, is liye wahi seedha use hota hai.
// Instagram aur Pinterest raw iframe embedding ko X-Frame-Options se block kar dete
// hain — unke liye VideoCard unke apne official embed widgets (embed.js / pinit.js)
// use karta hai, is liye yahan unka embedUrl null rehta hai jaan-boojh kar.
export function getVideoEmbedInfo(url) {
  const platform = detectPlatform(url);

  if (platform === 'youtube') {
    return { platform, embedUrl: getYoutubeEmbedUrl(url) };
  }
  return { platform, embedUrl: null };
}
