export const prerender = false;

import type { CurrentlyPlaying, RecentlyPlayed } from "@lib/spotify";

const SPOTIFY_CURRENTLY_PLAYING_API_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const SPOTIFY_LAST_PLAYED_API_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played";
const SPOTIFY_TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

function logEnvironmentVariables() {
  console.log("Checking environment variables:");
  console.log(
    "SPOTIFY_CLIENT_ID:",
    import.meta.env.SPOTIFY_CLIENT_ID ? "Set" : "Not set"
  );
  console.log(
    "SPOTIFY_CLIENT_SECRET:",
    import.meta.env.SPOTIFY_CLIENT_SECRET ? "Set" : "Not set"
  );
  console.log(
    "SPOTIFY_REFRESH_TOKEN:",
    import.meta.env.SPOTIFY_REFRESH_TOKEN ? "Set" : "Not set"
  );
}

async function getAccessToken() {
  console.log("Attempting to fetch Spotify access token");
  try {
    if (
      !import.meta.env.SPOTIFY_CLIENT_ID ||
      !import.meta.env.SPOTIFY_CLIENT_SECRET ||
      !import.meta.env.SPOTIFY_REFRESH_TOKEN
    ) {
      throw new Error("Missing required environment variables");
    }

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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Successfully obtained access token");
    return data.access_token as string;
  } catch (error) {
    console.error("Error fetching Spotify access token:", error);
    return null;
  }
}

export async function GET() {
  console.log("Received GET request for Spotify data");
  logEnvironmentVariables();

  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error("Failed to obtain access token");
    }

    console.log("Fetching currently playing track");
    const response = await fetch(SPOTIFY_CURRENTLY_PLAYING_API_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Currently playing API response status:", response.status);

    if (response.status === 204) {
      console.log("No track currently playing, fetching last played track");
      try {
        const response = await fetch(SPOTIFY_LAST_PLAYED_API_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = (await response.json()) as RecentlyPlayed;
        console.log("Successfully fetched last played track");
        return new Response(JSON.stringify(data.items[0]), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Error fetching last played track:", error);
        return new Response(
          JSON.stringify({
            error: "Failed to fetch last played track",
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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as CurrentlyPlaying;
    console.log("Successfully fetched currently playing track");

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in GET request:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch Spotify data",
        details: error instanceof Error ? error.message : String(error),
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
