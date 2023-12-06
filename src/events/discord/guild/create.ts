import { EventType, eventModule } from '@sern/handler';
import { Events, Guild } from 'discord.js';
import guildSchema from '#schemas/guild';

export default eventModule({
	type: EventType.Discord,
	name: Events.GuildCreate,
	async execute(guild: Guild) {
		let Guild = await guildSchema.findOne({ guildId: guild.id });

		if (!Guild) {
			await new guildSchema({
				name: guild.name,
				guildId: guild.id,
			}).save();
		} else {
			return guildSchema;
		}
	},
});
