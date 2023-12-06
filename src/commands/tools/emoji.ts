import { publish } from '#plugins';
import { findEmoji } from '#utils';
import { commandModule, CommandType } from '@sern/handler';

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'Sends a random emoji.',
	options: [],
	execute: async ({ interaction }) => {
		await findEmoji(interaction);
	},
});
