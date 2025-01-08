import { getNowPlaying } from "@lib/spotify";
import { createResource, Match, Switch } from "solid-js";

export const SpotifyNowPlaying = () => {
  const [spotifyData, { refetch }] = createResource(getNowPlaying);

  // Fetch the currently playing song every 30 seconds
  setInterval(() => {
    refetch();
  }, 60000);

  return (
    <div class="bg-neutral-50/25 dark:bg-neutral-800/40 rounded-lg px-2.5 py-1.5 flex items-center space-x-3 border dark:border-gray-400/10">
      <Switch>
        <Match when={spotifyData.loading && !spotifyData()}>
          <div class="size-12 bg-gray-100 dark:bg-neutral-600/50 rounded-md animate-pulse"></div>
          <div class="flex-grow space-y-2">
            <div class="w-24 h-2 bg-gray-100 dark:bg-neutral-600/50 rounded-md animate-pulse"></div>
            <div class="w-16 h-2 bg-gray-100 dark:bg-neutral-600/50 rounded-md animate-pulse"></div>
          </div>
        </Match>
        <Match when={spotifyData.error || spotifyData() === null}>
          <div class="w-full flex items-center space-x-2 text-center text-gray-500 dark:text-gray-400">
            <svg
              class="size-5 ml-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              ></path>
            </svg>
            <p class="text-sm">Not currently playing</p>
          </div>
        </Match>
        <Match when={spotifyData()}>
          <img
            src={spotifyData()?.albumImageUrl as string}
            width={64}
            height={64}
            loading="eager"
            alt={`${spotifyData()?.title} album cover`}
            class="size-12 rounded-md"
          />
          <div class="flex flex-col flex-grow gap-0">
            <h3 class="font-semibold text-sm">{spotifyData()?.title}</h3>
            <p class="truncate w-10/12 text-[13px]">{spotifyData()?.artist}</p>
            {spotifyData()?.isPlaying ? (
              <p class="text-green-700 dark:text-green-500 text-[13px] flex items-center">
                <span class="animate-pulse mr-2">▶</span>
                Now playing
                <span class="animate-pulse">...</span>
              </p>
            ) : (
              <p class="text-neutral-500 text-[13px]">
                Last played on {spotifyData()?.lastPlayedAt}
              </p>
            )}
          </div>
          <a
            href={spotifyData()?.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="text-green-500"
            aria-label="Listen on Spotify"
          >
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </a>
        </Match>
      </Switch>
    </div>
  );
};
