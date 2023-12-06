import { publish } from '#plugins';
import { messagesOptions } from '#utils';
import { commandModule, CommandType } from '@sern/handler';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ChannelType,
	Collection,
	EmbedBuilder,
	Message,
	TextChannel,
} from 'discord.js';
import { setTimeout } from 'node:timers/promises';
import { generateFromMessages } from 'discord-html-transcripts';
import GuildSchema from '#schemas/guild';

export default commandModule({
	type: CommandType.Slash,
	plugins: [
		publish({
			defaultMemberPermissions: ['ManageChannels', 'ManageMessages'],
			dmPermission: false,
		}),
	],
	description: 'Manages messages in a guild.',
	options: messagesOptions,
	execute: async (ctx, [, options]) => {
		const sub = options.getSubcommand();
		const Guild = await GuildSchema.findOne({ guildId: ctx.guildId });
		const responseEmbed = new EmbedBuilder().setColor('Blurple');
		const logEmbed = new EmbedBuilder()
			.setColor('DarkNavy')
			.setAuthor({ name: 'PURGE COMMAND USED' });
		const logEmbedDescription: string[] = [];
		let _toDelete: Collection<string, Message<true>> = new Collection();

		switch (sub) {
			case 'bulk_delete':
				let i = 0;
				const bulk_amount = options.getNumber('bulk_amount', true);
				let bulk_channel =
					(options.getChannel('channel') as TextChannel) ||
					(ctx.channel as TextChannel);
				if (!bulk_channel) bulk_channel = ctx.channel as TextChannel;
				const bulk_reason =
					options.getString('bulk_reason') || 'No reason provided.';
				await bulk_channel.messages.fetch();

				if (bulk_amount < 0 || bulk_amount > 100) {
					return await ctx.reply({
						content:
							'Delete Amount invalid! Number should be between 0 and 100.',
						ephemeral: true,
					});
				} else {
					await bulk_channel
						.bulkDelete(bulk_amount, true)
						.then(async (messages) => {
							messages.map((m) => {
								_toDelete.set(m?.id!, m as Message<true>);
							});

							await ctx.reply({
								embeds: [
									responseEmbed.setDescription(
										`🧹 Cleared \`${messages.size}\` messages.`
									),
								],
								ephemeral: true,
							});
							const logChannel = ctx.guild?.channels.cache.get(
								Guild?.logChannel!
							) as TextChannel;

							const TransScript = await generateFromMessages(
								_toDelete,
								bulk_channel,
								{
									filename: 'DeleteMessages.txt',
									saveImages: true,
									footerText: `Exported ${i} message{s}.`,
								}
							);

							logEmbedDescription.push(
								`• Moderator: ${ctx.member}`,
								`• Channel: ${bulk_channel}`,
								`• Reason: ${bulk_reason}`,
								`• Total Messages Deleted: ${messages.size}`
							);
							logChannel?.send({
								embeds: [
									logEmbed.setDescription(logEmbedDescription.join('\n')),
								],
								files: [TransScript],
							});
						});
				}

				break;

				// case 'edit':
				// 	const targetChannel = options.getChannel('location');
				// 	const targetMessage = options.getString('message_id');
				// 	let chan = (await ctx.guild?.channels.fetch(
				// 		targetChannel?.id!
				// 	)) as TextChannel;
				// 	let mssg = await chan.messages.fetch(targetMessage!);
				// 	console.log(mssg.components);
				// 	let row = new ActionRowBuilder<ButtonBuilder>({
				// 		components: [
				// 			new ButtonBuilder({
				// 				custom_id: 'test',
				// 				disabled: true,
				// 				label: 'Test',
				// 				style: 2,
				// 			}),
				// 		],
				// 	});
				// 	await mssg.edit({ components: [row] });
				break;

			case 'move':
				const new_channel = options.getChannel('new_channel') as TextChannel;
				const move_reason = options.getString('move_reason', true);
				const message_link = options.getString('message_link', true);
				const link = options.getString('message_link')!;
				const [, guild, channel, message] =
					/(?:(?:https?:\/\/(?:(?:canary|ptb)\.)?discord\.com\/)|discord:\/\/)channels\/(\d{16,20}|@me)\/(\d{16,20})\/(\d{16,20})/.exec(
						link
					)!;
				console.log(link + `\n${guild}/${channel}/${message}`);
				break;

			case 'prune':
				const user = options.getUser('user', true);
				const prune_amount = options.getNumber('prune_amount', true);
				const prune_channel = options.getChannel(
					'offending_channel'
				) as TextChannel;

				if (prune_channel) {
					await prune_channel.messages.fetch();
					await prune_channel.bulkDelete(prune_amount, true);
				} else {
					try {
						let x = 0;
						let allChannels = ctx.interaction.guild?.channels.cache?.filter(
							(ch) => ch?.type === ChannelType.GuildText
						)!;
						(allChannels as Collection<string, TextChannel>)?.forEach(
							async (chan) => {
								(await chan.messages.fetch()).filter(async (msg) => {
									if (
										msg.author.id === user.id &&
										prune_amount > 0 &&
										prune_amount < 100
									) {
										_toDelete.set(msg.id, msg);
										x++;
										await chan
											.bulkDelete(_toDelete, true)
											.then(async (messages) => {
												logEmbedDescription.push(
													`• Total Messages Deleted: ${messages.size}\n• Target: ${user}`
												);
												await ctx.reply({
													embeds: [
														responseEmbed.setDescription(
															`🧹 Cleared \`${messages.size}\` messages.`
														),
													],
													ephemeral: true,
												});
												const logChannel = ctx.guild?.channels.cache.get(
													Guild?.logChannel!
												) as TextChannel;

												const TransScript = await generateFromMessages(
													_toDelete,
													bulk_channel,
													{
														filename: 'DeleteMessages.txt',
														saveImages: true,
														footerText: `Exported ${x} message{s}.`,
													}
												);

												logEmbedDescription.push(
													`• Moderator: ${ctx.member}`,
													`• Channel: ${bulk_channel}`,
													`• Reason: ${bulk_reason}`,
													`• Total Messages Deleted: ${messages.size}`
												);
												logChannel?.send({
													embeds: [
														logEmbed.setDescription(
															logEmbedDescription.join('\n')
														),
													],
													files: [TransScript],
												});
											});
									}
								});
							}
						);
					} catch (error) {}
				}

				break;
		}
	},
});
