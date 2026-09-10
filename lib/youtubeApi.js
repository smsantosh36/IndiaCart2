let apiPromise = null;

// YouTube ka official IFrame Player API load karta hai. Isse hum:
// 1) autoplay/mute/loop properly control kar sakte hain (raw postMessage guess ki jagah)
// 2) embedding-disabled jaisi asal errors detect kar sakte hain aur clean fallback dikha sakte hain
export function loadYouTubeApi() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);

  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.();
        resolve(window.YT);
      };

      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(script);
      }
    });
  }

  return apiPromise;
}
