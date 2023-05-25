import { disable, publish } from '#plugins';
import { commandModule, CommandType } from '@sern/handler';
import { ComponentType, EmbedBuilder } from 'discord.js';

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish(), disable()],
	description: 'Play games!',
	execute: async (ctx) => {
		const embeds = [
			new EmbedBuilder({
				title: 'GameCord Gaming!',
				description:
					'Please choose a game to play! You have 10 seconds to pick.',
				image: { url: 'https://i.imgur.com/WWs7fxo.png' },
				footer: {
					text: 'Gaming with friends!',
					icon_url: ctx.client.user?.displayAvatarURL({
						size: 1024,
						forceStatic: true,
					}),
				},
			}),
		];

		const components = (state: boolean) => [
			{
				type: 1,
				components: [
					{
						type: 3,
						custom_id: 'gamecord-games',
						placeholder: 'Please select a category',
						disabled: state,
						// options: emojis.map((e) => {
						// 	let gameName = capitalise(e.name);
						// 	return {
						// 		label: `${gameName}`,
						// 		value: `${gameName}`,
						// 		description: `Time to play ${gameName}!`,
						// 		//@ts-expect-error
						// 		emoji: `${emoji_s[gameName.toLowerCase()]}`,
						// 	};
						// }),
					},
				],
			},
		];
		const msg = await ctx.reply({
			embeds,
			components: components(false),
		});

		const collector = msg.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			filter: (i) => ctx.user.id === i.user.id,
			time: 10000,
		});

		collector.on('ignore', async (i) => {
			await i.reply({
				content: "Don't be ignorant!",
				ephemeral: true,
			});
		});

		collector.on('collect', async (i) => {
			const [game] = i.values;
			i.update({
				content: `You selected: ` + game,
				embeds: [],
				components: [],
			});
		});

		collector.on('end', async (_, r) => {
			if (r === 'finished') return;
			await ctx.interaction
				.editReply({
					content: "Time's up",
					components: [],
					embeds: [],
				})
				.then((m) => {
					setTimeout(async () => {
						m.delete();
					}, 5000);
				});
		});
	},
});
