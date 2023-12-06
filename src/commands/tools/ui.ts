import { publish } from '#plugins';
import { env } from '#utils';
import { commandModule, CommandType } from '@sern/handler';
import { request } from 'undici';

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'User info',
	options: [],
	execute: async (ctx, options) => {
		request(
			`https://discord.com/api/v10/guilds/716249660838379541/members/${ctx.member?.user.id}`,
			{
				headers: {
					Authorization: `Bot ${env.DISCORD_TOKEN}`,
				},
			}
		).then(async (res) => console.log(await res.body.json()));
		await ctx.reply({ content: 'done', ephemeral: true });
	},
});
