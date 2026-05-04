import Image from "next/image";
import { getNowPlaying } from "@/lib/spotify";

export default async function SpotifyNowPlaying() {
  const np = await getNowPlaying();

  if (!np.isPlaying) {
    return (
      <div className="flex items-center gap-2 mono text-[11px] uppercase tracking-[0.18em] text-[var(--text)]">
        <span className="w-2 h-2 rounded-full bg-[var(--border2)]" />
        Not playing
      </div>
    );
  }

  return (
    <a
      href={np.songUrl ?? "https://open.spotify.com"}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 max-w-full"
      aria-label={`Now playing on Spotify: ${np.title} by ${np.artist}`}
    >
      <span className="relative flex items-center justify-center">
        <span className="absolute inline-flex w-2 h-2 rounded-full bg-[var(--green)]/70 animate-ping" />
        <span className="relative w-2 h-2 rounded-full bg-[var(--green)]" />
      </span>
      {np.albumImageUrl ? (
        <Image
          src={np.albumImageUrl}
          alt={np.album ? `${np.album} album art` : "Album art"}
          width={28}
          height={28}
          className="rounded-md border border-[var(--border)]"
          unoptimized
        />
      ) : null}
      <span className="flex flex-col min-w-0">
        <span className="text-xs text-[var(--text2)] group-hover:text-[var(--accent)] transition-colors truncate max-w-[180px]">
          {np.title}
        </span>
        <span className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--text)] truncate max-w-[180px]">
          {np.artist}
        </span>
      </span>
    </a>
  );
}
