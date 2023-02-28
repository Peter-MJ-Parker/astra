import { EventType, eventModule } from "@sern/handler";
import { Events, Guild } from "discord.js";

export default eventModule({
  type: EventType.Discord,
  name: Events.GuildDelete,
  async execute(guild: Guild) {},
});
