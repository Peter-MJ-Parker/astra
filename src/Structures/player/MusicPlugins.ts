import { SpotifyPlugin } from "@distube/spotify";
import { SoundCloudPlugin } from "@distube/soundcloud";
import { DeezerPlugin } from "@distube/deezer";
import { YtDlpPlugin } from "@distube/yt-dlp";
import { env } from "#utils";

export const Deezer = () =>
  new DeezerPlugin({ emitEventsAfterFetching: true, parallel: true });
export const SC = () => new SoundCloudPlugin();
export const YT = () => new YtDlpPlugin({ update: true });
export const SPO = () =>
  new SpotifyPlugin({
    emitEventsAfterFetching: true,
    api: {
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_SECRET,
    },
    parallel: true,
  });
