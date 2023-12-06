import { commandModule, CommandType } from '@sern/handler';
import type { TextChannel } from 'discord.js';

export default commandModule({
	type: CommandType.Button,
	execute: async (interaction) => {
		let msg = await (interaction.channel! as TextChannel)?.messages.fetch({
			message: interaction.message.reference?.messageId!,
		});
		await msg.edit({ content: msg.embeds[0].image?.url!, embeds: [] });
		await interaction.update({
			components: [],
			embeds: [],
			content: `Feel free to dismiss me!`,
		});
	},
});
