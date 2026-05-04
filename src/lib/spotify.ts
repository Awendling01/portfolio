export type NowPlaying = {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
};

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) return null;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  let res: Response;
  try {
    res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
      next: { revalidate: 3300 },
    });
  } catch {
    return null;
  }

  if (!res.ok) return null;
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

export async function getNowPlaying(): Promise<NowPlaying> {
  const token = await getAccessToken();
  if (!token) return { isPlaying: false };

  let res: Response;
  try {
    res = await fetch(NOW_PLAYING_URL, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 30 },
    });
  } catch {
    return { isPlaying: false };
  }

  if (res.status === 204 || res.status > 400) return { isPlaying: false };

  let data: {
    is_playing?: boolean;
    item?: {
      name?: string;
      artists?: { name: string }[];
      album?: { name?: string; images?: { url: string }[] };
      external_urls?: { spotify?: string };
    };
  };
  try {
    data = await res.json();
  } catch {
    return { isPlaying: false };
  }

  if (!data.item || !data.is_playing) return { isPlaying: false };

  return {
    isPlaying: true,
    title: data.item.name,
    artist: (data.item.artists ?? []).map((a) => a.name).join(", "),
    album: data.item.album?.name,
    albumImageUrl: data.item.album?.images?.[0]?.url,
    songUrl: data.item.external_urls?.spotify,
  };
}
