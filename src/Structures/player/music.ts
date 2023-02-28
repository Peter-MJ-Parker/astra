import type { ASTRA } from "#client";
import { DisTube } from "distube";
import { Deezer, SC, SPO, YT } from "#music";

export class MusicPlayer extends DisTube {
  constructor(client: ASTRA) {
    super(client, {
      ytdlOptions: {
        highWaterMark: 1 << 25,
      },
      plugins: [Deezer(), SC(), SPO(), YT()],
      leaveOnEmpty: true,
      emptyCooldown: 5,
      leaveOnStop: false,
      emitNewSongOnly: false,
      emitAddSongWhenCreatingQueue: false,
      emitAddListWhenCreatingQueue: false,
      joinNewVoiceChannel: false,
      leaveOnFinish: false,
      nsfw: false,
      searchCooldown: 10000,
    });
  }
}

export const config = {
  emojis: {
    play: "▶️",
    stop: "⏹️",
    queue: "📄",
    success: "✅",
    repeat: "🔁",
    error: "❌",
  },
};
