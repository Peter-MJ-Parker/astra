import { EventType, eventModule } from '@sern/handler';
import { Events, GuildMember, type PartialGuildMember } from 'discord.js';

export default eventModule({
	type: EventType.Discord,
	name: Events.GuildMemberUpdate,
	async execute(
		oldMember: GuildMember | PartialGuildMember,
		newMember: GuildMember
	) {},
});
