import { EventType, eventModule } from "@sern/handler";
import { Events, Guild } from "discord.js";
import guildSchema from "../../../Structures/mongo/schemas/guild.js";

export default eventModule({
	type: EventType.Discord,
	name: Events.GuildCreate,
	async execute(guild: Guild) {
		if (await guildSchema.exists({ guildId: guild.id })) {
			await guildSchema.deleteOne({ guildId: guild.id });
			await new guildSchema({
				guildId: guild.id,
				name: guild.name,
			}).save();
		} else {
			await new guildSchema({
				guildId: guild.id,
				name: guild.name,
			}).save();
		}
	},
});
