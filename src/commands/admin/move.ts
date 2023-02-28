import { publish } from "#handler";
import { commandModule, CommandType } from "@sern/handler";
import {
	ActionRowBuilder,
	ChannelSelectMenuBuilder,
	ChannelType,
	ComponentType,
	EmbedBuilder,
	TextChannel,
} from "discord.js";

export default commandModule({
	type: CommandType.CtxMsg,
	plugins: [publish({ defaultMemberPermissions: ["Administrator"] })],
	description: "Moves a message from one channel to another.",
	execute: async (ctx) => {
		let msg = ctx.targetMessage;
		let selector = await ctx.reply({
			ephemeral: true,
			content: "Where would you like to move the message to?",
			components: [
				new ActionRowBuilder<ChannelSelectMenuBuilder>({
					type: 1,
					components: [
						new ChannelSelectMenuBuilder({
							channel_types: [ChannelType.GuildText],
							custom_id: "channel_move",
							min_values: 1,
							max_values: 1,
							placeholder:
								"Select the channel you wish to move to.",
						}),
					],
				}),
			],
		});

		const collector = selector.createMessageComponentCollector({
			componentType: ComponentType.ChannelSelect,
			time: 10000,
		});

		collector.on("ignore", async (i) => {
			i.reply({
				content: "Okay, ignoramous. This isn't for you!",
				ephemeral: true,
			});
		});

		collector.on("collect", async (select) => {
			const [channel] = select.values;
			let newId: string;
			((await ctx.guild?.channels.fetch(channel)) as TextChannel)
				.createWebhook({
					name: msg.author.username,
					avatar: msg.author.displayAvatarURL(),
				})
				.then(async (s) => {
					let sent = s.send({
						content: msg.cleanContent,
					});
					newId = (await sent).url;
					let user = msg.author;
					let msgChannel = (await ctx.guild?.channels.fetch(
						msg.channelId
					)) as TextChannel;
					await msgChannel
						.send({
							embeds: [
								new EmbedBuilder({
									description: `${user}, I have moved your message [here](${newId})`,
								}),
							],
						})
						.then((m) => {
							setTimeout(() => {
								m.delete();
							}, 3000);
						})
						.catch((e) => {
							console.log(e);
						});

					await s.delete();
					await msg.delete();
					collector.stop("finished");
					await ctx.editReply({
						content: "Done",
						components: [],
					});
				});
		});

		collector.on("end", async (_, e) => {
			if (e === "finished") return;

			await ctx.editReply({
				content: "Time's up!",
				components: [],
			});
		});
	},
});
