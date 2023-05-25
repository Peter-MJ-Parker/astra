import { publish } from '#plugins';
import { commandModule, CommandType } from '@sern/handler';
import { ApplicationCommandOptionType } from 'discord.js';
import ranks from '#schemas/rank';

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'Shows a users rank (per guild).',
	options: [
		{
			name: 'user',
			description: 'Select a user to display their rank.',
			type: ApplicationCommandOptionType.User,
		},
	],
	execute: async ({ interaction }, [, options]) => {},
});
