import { client } from '#Astra';
import { publish, requirePermission } from '#plugins';
import { commandModule, CommandType } from '@sern/handler';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Colors,
	ComponentType,
	EmbedBuilder,
	StringSelectMenuBuilder,
} from 'discord.js';

export default commandModule({
	type: CommandType.Slash,
	plugins: [
		publish({ dmPermission: false, defaultMemberPermissions: 'ManageGuild' }),
		requirePermission('both', ['ManageChannels', 'ManageRoles']),
	],
	description: 'Setup server options in my database.',
	execute: async ({ interaction }) => {
		const embeds = [
			new EmbedBuilder({
				color: Colors.Blue,
				title: 'Setup',
				description:
					'This menu will guide you through the different things you can setup. Not all are required. Select the System that you would like to setup.',
				fields: [
					{
						name: 'Member Logging',
						value: '👨‍👩‍👦‍👦|Setup member join and leaving.',
						inline: true,
					},
					{
						name: 'Music System (Coming Soon)',
						value: '🎶|Setup member music system.',
						inline: true,
					},
					{
						name: 'XP Logging',
						value: '8️⃣|Setup XP System.',
						inline: true,
					},
					{
						name: 'Bot Spam',
						value: '🤖|Setup channel for bot notifications.',
						inline: true,
					},
					{
						name: 'Gaming System (Coming Soon)',
						value: '🕹️|Setup gaming channels.',
						inline: true,
					},
					{
						name: 'Ticket System',
						value: '🎫|Setup Ticket System',
						inline: true,
					},
				],
				footer: {
					text: 'Click on the Finished button when you are done.',
				},
			}),
		];
		const fields = embeds[0].data.fields?.map((field) => {
			const name: string = field.name!;
			const desc: string = field.value!;
			return { name, desc };
		})!;
		const components = [
			new ActionRowBuilder<StringSelectMenuBuilder>({
				components: [
					new StringSelectMenuBuilder({
						custom_id: 'setup-menu',
						placeholder: 'What would you like to setup?',
						type: ComponentType.StringSelect,
						options: fields?.map((mapped) => {
							const { name, desc } = mapped;
							return {
								label: name.toString(),
								value: `setup:${name.toLowerCase().replace(' ', '-')}`,
								description: desc.split('|')[1].toString(),
								emoji: desc.split('|')[0].toString(),
							};
						}),
					}),
				],
			}),
			new ActionRowBuilder<ButtonBuilder>({
				components: [
					new ButtonBuilder({
						custom_id: 'setup-complete',
						emoji: '✅',
						label: 'Finished',
						style: ButtonStyle.Success,
						type: 2,
					}),
				],
			}),
		];
		const reply = await interaction.reply({
			embeds,
			components,
		});
		const col = reply.createMessageComponentCollector({
			time: 10000,
			filter: (i) => i.user.id === interaction.user.id,
		});

		col.on('ignore', async (bad) => {
			bad.reply({
				content: "Okay, ignoramous. This isn't for you!",
				ephemeral: true,
			});
		});

		let collected: string = 'false';
		col.on('collect', async (i) => {
			collected = 'true';
			if (i.customId === 'setup-complete') {
				let msg = await i.update({
					content: `Server setup is now complete.\nIf your channels change, run the command again to save new info!\n\nDeleting message in 5 seconds...`,
					embeds: [],
					components: [],
				});
				setTimeout(async () => {
					await msg.delete();
				}, 5000);
			} else col.resetTimer();
		});

		col.on('end', async (_, e) => {
			if (e === 'time' && collected === 'false') {
				const ended = await interaction.editReply({
					content: "Time's up!",
					components: [],
					embeds: [],
				});
				setTimeout(async () => {
					await ended.delete();
				}, 5000);
			} else return;
		});
	},
});
