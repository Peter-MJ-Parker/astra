import { EventType, eventModule } from "@sern/handler";
import { Events, Guild } from "discord.js";
import guildSchema from "#schemas/guild";

export default eventModule({
	type: EventType.Discord,
	name: Events.GuildDelete,
	async execute(Guild: Guild) {
		if (await guildSchema.exists({ guildId: Guild.id })) {
			await guildSchema.deleteOne({ guildId: Guild.id });
		}
	},
});
