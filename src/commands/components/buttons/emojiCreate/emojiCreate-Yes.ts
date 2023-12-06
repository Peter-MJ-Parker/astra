import { commandModule, CommandType } from '@sern/handler';
import { EmbedBuilder, TextChannel } from 'discord.js';

export default commandModule({
	type: CommandType.Button,
	description: 'Adds emoji to server.',
	execute: async (interaction) => {
		const levels: object[] = [
			{ level: 0, amount: 50 },
			{ level: 1, amount: 100 },
			{ level: 2, amount: 150 },
			{ level: 3, amount: 250 },
		];
		// if (interaction.guild.emojis.cache.size)
		let msg = await (interaction.channel! as TextChannel)?.messages.fetch({
			message: interaction.message.reference?.messageId!,
		});
		await interaction.guild!.emojis.create({
			attachment: `${msg.embeds[0].image?.url!}`,
			name: `${msg.embeds[0].title}`,
		});
		await msg.edit({ content: msg.embeds[0].image?.url!, embeds: [] });
		return await interaction.update({
			components: [],
			embeds: [
				EmbedBuilder.from({
					title: `I have added ${msg.embeds[0].title} to your guild emojis.`,
					image: {
						url: `${msg.embeds[0].image?.url!}`,
						height: 512,
						width: 512,
					},
				}),
			],
		});
	},
});
