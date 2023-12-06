import { ownerOnly, confirm } from '#plugins';
import { commandModule, CommandType } from '@sern/handler';
import type { TextChannel } from 'discord.js';

export default commandModule({
	type: CommandType.StringSelect,
	plugins: [
		ownerOnly(),
		confirm({
			content: 'Are you sure you want to delete that command?',
			denialMessage: "Okay, I won't delete that command!",
		}),
	],
	description: 'Deletes an Application Command.',
	execute: async (interaction) => {
		const id = interaction.values[0];
		const command = await interaction.client.application?.commands.fetch(
			`${id}`
		);
		await (interaction.channel as TextChannel).messages
			.fetch({
				message: interaction.message.id,
			})
			.then((menu) => {
				setTimeout(async () => {
					await menu.delete();
				}, 5000);
			});
		await command.delete().then(() => {
			interaction
				.editReply({
					content: `I have deleted command: **${command.name}**.`,
				})
				.then((reply) => {
					setTimeout(async () => {
						await reply.delete();
					}, 5000);
				});
		});
	},
});
