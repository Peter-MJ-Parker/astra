import { publish } from '#plugins';
import { commandModule, CommandType } from '@sern/handler';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { unfurl } from 'unfurl.js';

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'Shows users profiles from different platforms.',
	options: [
		{
			name: 'platform',
			description: 'Platform to search.',
			type: ApplicationCommandOptionType.String,
			// required: true,
			autocomplete: true,
			command: {
				onEvent: [],
				execute: async (ctx) => {
					const focusedValue = ctx.options.getFocused(true);
					const choices = ['steam', 'sc', 'ig', 'twitter'];
					const filtered = choices.filter((choice) =>
						choice.startsWith(focusedValue.value)
					);
					await ctx.respond(
						filtered.map((choice) => ({
							name: choice,
							value: choice,
						}))
					);
				},
			},
		},
		{
			name: 'username',
			description: 'Input username to search for on this platform.',
			type: ApplicationCommandOptionType.String,
			// required: true,
		},
	],
	execute: async ({ interaction }, [, options]) => {
		await interaction.deferReply({ fetchReply: true });
		const platform = options.getString('platform');
		const username = options.getString('username');

		// await interaction.editReply({ content: `${profile.oEmbed!}` });
	},
});
