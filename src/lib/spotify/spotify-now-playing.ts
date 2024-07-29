import type { CurrentlyPlaying, RecentlyPlayed } from "./types";

const SPOTIFY_API_ENDPOINT = `${
  import.meta.env.BASE_URL
}api/spotify-now-playing`;

export async function getNowPlaying() {
  try {
    const response = await fetch(SPOTIFY_API_ENDPOINT);
    const data = (await response.json()) as
      | CurrentlyPlaying
      | RecentlyPlayed["items"][0];

    if ("is_playing" in data) {
      return {
        isPlaying: data.is_playing,
        title: data.item.name,
        artist: data.item.artists.map(artist => artist.name).join(", "),
        albumImageUrl: data.item.album.images[0].url,
        songUrl: data.item.external_urls.spotify,
        hasPreview: data.item.preview_url !== null,
      };
    }

    return {
      albumImageUrl: data.track.album.images[0].url,
      title: data.track.name,
      artist: data.track.artists.map(artist => artist.name).join(", "),
      songUrl: data.track.external_urls.spotify,
      isPlaying: false,
      hasPreview: data.track.preview_url !== null,
      lastPlayedAt: new Date(data.played_at).toLocaleString(),
    };
  } catch (error) {
    console.error("Error fetching now playing data:", error);
    return null;
  }
}
