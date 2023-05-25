import { publish } from '#plugins';
import { commandModule, CommandType } from '@sern/handler';

export default commandModule({
	type: CommandType.CtxUser,
	plugins: [publish()],
	description: 'Sends users profile image.',
	execute: async (ctx) => {
		ctx.reply({
			ephemeral: true,
			content: `${ctx.targetUser.displayAvatarURL({ size: 1024 })}`,
		});
	},
});
