import { autoMute, badLinks } from '#utils';
import { EventType, eventModule } from '@sern/handler';
import { Events, Message } from 'discord.js';

export default eventModule({
	type: EventType.Discord,
	name: Events.MessageCreate,
	async execute(message: Message) {
		// const [[first, second]] = message.mentions.members?.entries()!;
		// console.log(first, second);
		const [first, second, third, fourth] = message.mentions.members?.first(2)!;
		console.log(first, second, third, fourth);
		if (message.author.bot || message.system || !message.inGuild()) return;

		if (badLinks.some((word) => message.content.includes(word))) {
			await autoMute(
				message.author.id,
				message.guildId!,
				'Bad Link Usage',
				message
			);
			await message.delete();
		}
	},
});
