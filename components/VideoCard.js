import { useEffect, useRef, useState } from 'react';
import { loadEmbedScript } from '../lib/embedScripts';
import { loadYouTubeApi } from '../lib/youtubeApi';

const PLATFORM_LABEL = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  pinterest: 'Pinterest',
  other: 'the original post'
};

export default function VideoCard({ video }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likeCount || 0);
  const [muted, setMuted] = useState(true);
  const [playerError, setPlayerError] = useState(false);

  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const elementId = `yt-player-${video.id}`;

  // YouTube video ID base embedUrl se nikalte hain (embedUrl = .../embed/VIDEO_ID)
  const youtubeId = video.embedUrl ? video.embedUrl.split('/').pop() : '';

  useEffect(() => {
    // Instagram aur Pinterest raw iframe embedding ko block kar dete hain (X-Frame-Options),
    // is liye unke official widget scripts se hi embed banwate hain.
    if (video.platform === 'instagram') {
      loadEmbedScript('https://www.instagram.com/embed.js', () => {
        window.instgrm?.Embeds?.process();
      });
    } else if (video.platform === 'pinterest') {
      loadEmbedScript('https://assets.pinterest.com/js/pinit.js', () => {
        window.PinUtils?.build();
      });
    }
  }, [video.platform, video.url]);

  useEffect(() => {
    if (video.platform !== 'youtube' || !youtubeId) return undefined;
    let destroyed = false;

    loadYouTubeApi().then((YT) => {
      if (!YT || destroyed || !containerRef.current) return;

      playerRef.current = new YT.Player(containerRef.current, {
        videoId: youtubeId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: youtubeId,
          playsinline: 1,
          rel: 0
        },
        events: {
          onError: () => {
            // 2: invalid id, 5: HTML5 error, 100: not found/private,
            // 101/150: owner ne embedding disable ki hui hai
            setPlayerError(true);
          }
        }
      });
    });

    return () => {
      destroyed = true;
      playerRef.current?.destroy?.();
    };
  }, [video.platform, youtubeId]);

  function handleLike() {
    if (liked) return; // ek visitor ek hi baar like kar sake
    setLiked(true);
    setLikeCount((c) => c + 1);
    fetch(`/api/videos/${video.id}/like`, { method: 'POST' }).catch(() => {});
  }

  function handleFollow() {
    fetch(`/api/videos/${video.id}/follow`, { method: 'POST' }).catch(() => {});
    if (video.followUrl) {
      window.open(video.followUrl, '_blank', 'noopener');
    }
  }

  function toggleMute() {
    const player = playerRef.current;
    if (!player) return;
    if (muted) {
      player.unMute();
    } else {
      player.mute();
    }
    setMuted(!muted);
  }

  const showYoutubePlayer = video.platform === 'youtube' && youtubeId && !playerError;
  const showFallback =
    video.platform === 'other' ||
    (video.platform === 'youtube' && (!youtubeId || playerError));

  return (
    <div className="bg-white border border-line rounded-2xl overflow-hidden flex flex-col">
      {showYoutubePlayer && (
        <div className="relative aspect-[9/16] bg-ink">
          <div ref={containerRef} id={elementId} className="w-full h-full" />
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? 'Unmute' : 'Mute'}
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center text-sm hover:bg-black/80 transition-colors"
          >
            {muted ? '🔇' : '🔊'}
          </button>
        </div>
      )}

      {video.platform === 'instagram' && (
        <div className="bg-paper overflow-hidden flex items-center justify-center min-h-[300px]">
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={video.url}
            data-instgrm-version="14"
            style={{ margin: 0, width: '100%', minWidth: '100%' }}
          />
        </div>
      )}

      {video.platform === 'pinterest' && (
        <div className="bg-paper overflow-hidden flex items-center justify-center min-h-[300px] p-2">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a data-pin-do="embedPin" href={video.url} />
        </div>
      )}

      {showFallback && (
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="aspect-[9/16] bg-ink flex flex-col items-center justify-center gap-2 text-white text-center px-4"
        >
          <span className="text-3xl">▶</span>
          <span className="text-xs uppercase tracking-wide text-white/70">
            {playerError ? 'Embedding not available' : video.platform}
          </span>
        </a>
      )}

      <div className="p-4 flex flex-col gap-2">
        {video.caption && <p className="text-sm text-muted line-clamp-2">{video.caption}</p>}

        {/* Embed kabhi block/disabled ho jaaye to bhi original content tak
            pahunchne ka ek guaranteed rasta rehta hai */}
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-teal hover:underline w-fit"
        >
          Watch on {PLATFORM_LABEL[video.platform] || 'original site'} ↗
        </a>

        <button
          type="button"
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm font-medium w-fit ${
            liked ? 'text-mango' : 'text-muted'
          }`}
        >
          <span>{liked ? '❤️' : '🤍'}</span> {likeCount}
        </button>

        <button
          type="button"
          onClick={handleFollow}
          className="w-full bg-mango text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-orange-500 transition-colors"
        >
          {video.platform === 'youtube' ? 'Subscribe' : 'Follow'}
        </button>
      </div>
    </div>
  );
}
