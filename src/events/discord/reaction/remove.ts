import { EventType, discordEvent, eventModule } from '@sern/handler';
import { Events, MessageReaction, User } from 'discord.js';

export default discordEvent({
	name: Events.MessageReactionRemove,
	async execute(reaction, user) {},
});
