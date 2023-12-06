import { publish } from '#plugins';
import { commandModule, CommandType } from '@sern/handler';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'Returns roblox user data per username.',
	options: [
		{
			name: 'username',
			description: 'Username or roblox player.',
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
	execute: async ({ interaction }, [, options]) => {
		await interaction.deferReply({
			fetchReply: true,
			ephemeral: true,
		});
		const username = options.getString('username')!;
		const api = `https://api.roblox.com/users/get-by-username?username=${username}`;
		// const embed = new EmbedBuilder({
		// 	title: ``,
		// });
		fetch(api)
			.then(async (res) => {
				if (res.status === 429)
					return interaction.editReply({
						content: 'Too many requests. Try again later.',
					});
				const data = await res.json();
				if (!data) return await interaction.editReply('User not found!');
				console.log(data);

				await interaction.editReply({
					content: 'evaled',
				});
			})
			.catch((e) => console.log(e));
	},
});
