export const prerender = false;

import type { CurrentlyPlaying, RecentlyPlayed } from "@lib/spotify";

const SPOTIFY_CURRENTLY_PLAYING_API_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const SPOTIFY_LAST_PLAYED_API_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played";
const SPOTIFY_TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

async function getAccessToken() {
  try {
    const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          btoa(
            import.meta.env.SPOTIFY_CLIENT_ID +
              ":" +
              import.meta.env.SPOTIFY_CLIENT_SECRET
          ),
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: import.meta.env.SPOTIFY_REFRESH_TOKEN,
      }),
    });

    const data = await response.json();
    return data.access_token as string;
  } catch (error) {
    console.error("Error fetching Spotify access token:", error);
    return null;
  }
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(SPOTIFY_CURRENTLY_PLAYING_API_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 204) {
      try {
        const response = await fetch(SPOTIFY_LAST_PLAYED_API_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = (await response.json()) as RecentlyPlayed;
        return new Response(JSON.stringify(data.items[0]), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Error fetching Spotify data:", error);
        return new Response(
          JSON.stringify({
            error: "Failed to fetch Spotify data",
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    const data = (await response.json()) as CurrentlyPlaying;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching Spotify data:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch Spotify data",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
