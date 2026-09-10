const loadedScripts = {};

// Instagram/Pinterest ke official embed widget scripts (embed.js / pinit.js) load
// karta hai — agar pehle se load ho chuka hai to dobara load nahi karta.
export function loadEmbedScript(src, onReady) {
  if (typeof window === 'undefined') return;

  if (loadedScripts[src]) {
    onReady?.();
    return;
  }

  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) {
    existing.addEventListener('load', () => {
      loadedScripts[src] = true;
      onReady?.();
    });
    return;
  }

  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.onload = () => {
    loadedScripts[src] = true;
    onReady?.();
  };
  document.body.appendChild(script);
}
