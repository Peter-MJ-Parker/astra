import { publish } from '#plugins';
import { commandModule, CommandType } from '@sern/handler';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { getMeme } from '#utils';

export default commandModule({
	type: CommandType.Both,
	plugins: [publish()],
	description: 'Sends a meme in current channel',
	execute: async (ctx) => {
		const meme = await getMeme();

		const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId('meme-next')
				.setStyle(ButtonStyle.Secondary)
				.setLabel('Next Meme')
				.setEmoji('⏩')
		);

		ctx.reply({ embeds: [meme], components: [buttons] });
	},
});
