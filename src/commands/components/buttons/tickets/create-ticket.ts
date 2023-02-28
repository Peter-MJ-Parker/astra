import { commandModule, CommandType } from "@sern/handler";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChannelType,
	Colors,
	EmbedBuilder,
	Guild,
	GuildMember,
	TextChannel,
} from "discord.js";
import Tickets from "../../../../Structures/mongo/schemas/tickets/tickets.js";
import TicketCount from "../../../../Structures/mongo/schemas/tickets/ticketCount.js";
import TicketSetup from "../../../../Structures/mongo/schemas/tickets/ticketSetup.js";

export default commandModule({
	type: CommandType.Button,
	name: "create-ticket",
	description: "Creates a new ticket.",
	execute: async (interaction) => {
		const guild = interaction.guild as Guild;
		const member = interaction.member as GuildMember;
		const i = interaction;

		const TicketSetupDB = await TicketSetup.findOne({ GuildID: guild.id });
		if (!TicketSetupDB)
			return i.reply({
				content: `> **Alert:** Can't find any data on the setup:/`,
				ephemeral: true,
			});

		const TicketCountDB = TicketCount.findOne({ GuildID: guild.id });
		const Count = ((await TicketCountDB.countDocuments()) + 1).toString();

		const TicketLimit = await Tickets.findOne({
			GuildID: guild.id,
			Creator: member.id,
			Closed: false,
		});
		if (TicketLimit)
			return i.reply({
				content: `> **Warning:** You already have a ticket open`,
				ephemeral: true,
			});

		await interaction.deferUpdate();
		const embeds = [
			new EmbedBuilder({
				color: Colors.Blurple,
				author: {
					name: `${guild.name} | Ticket ID: ${Count}`,
					iconURL: guild.iconURL()!,
				},
				fields: [
					{
						name: `Information`,
						value: `\`-\` Provide details about your issue!\n\`-\` Provide a reason for the ticket!`,
					},
				],
			}),
		];
		let components = [
			new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder({
					custom_id: `close-ticket`,
					label: "Close Ticket",
					emoji: "⛔",
					style: ButtonStyle.Danger,
				})
			),
		];

		await (interaction.channel as TextChannel).threads
			.create({
				name: `${member.user.username}|`,
				type: ChannelType.PrivateThread,
				invitable: false,
				rateLimitPerUser: 4,
			})
			.then((ch) =>
				ch.send({
					content: `${member}, <@&${TicketSetupDB.SupportRoleID!}>`,
					embeds,
					components,
				})
			);

		// await guild.channels
		// 	.create({
		// 		name: `${
		// 			"Ticket" + "-" + interaction.user.username + "-" + Count
		// 		}`,
		// 		topic: `**Your ID:** ${member.id}\n**Ticket ID:** ${Count}`,
		// 		parent: TicketSetupDB.OpenCategoryID!,

		// 		type: ChannelType.PrivateThread,
		// 		permissionOverwrites: [
		// 			{
		// 				id: member.id,
		// 				allow: [
		// 					PermissionFlagsBits.SendMessages,
		// 					PermissionFlagsBits.ViewChannel,
		// 					PermissionFlagsBits.ReadMessageHistory,
		// 				],
		// 			},
		// 			{
		// 				id: TicketSetupDB.SupportRoleID!,
		// 				allow: [
		// 					PermissionFlagsBits.ViewChannel,
		// 					PermissionFlagsBits.SendMessages,
		// 					PermissionFlagsBits.ManageChannels,
		// 					PermissionFlagsBits.ManageMessages,
		// 				],
		// 			},
		// 			{
		// 				id: guild.roles.everyone.id,
		// 				deny: [PermissionFlagsBits.ViewChannel],
		// 			},
		// 			{
		// 				id: interaction.client.user.id,
		// 				allow: [
		// 					PermissionFlagsBits.ViewChannel,
		// 					PermissionFlagsBits.SendMessages,
		// 					PermissionFlagsBits.ManageChannels,
		// 					PermissionFlagsBits.ManageMessages,
		// 				],
		// 			},
		// 		],
		// 	})
		// 	.then(async (channel) => {
		// 		await Tickets.create({
		// 			GuildID: guild.id,
		// 			ChannelID: channel.id,
		// 			TicketID: Count,
		// 			CreatorID: member.user.id,
		// 			CreatorTag: member.user.tag,
		// 			MembersID: member.id,
		// 			CreatedAt: new Date().toLocaleString(),
		// 			Deleted: false,
		// 			Closed: false,
		// 			Archived: false,
		// 			MessageID: false,
		// 		})
		// 			.then(async () => {
		// 				await TicketCount.create({
		// 					GuildID: guild.id,
		// 					TicketCount: Count,
		// 				});
		// 			})
		// 			.then(async () => {
		// 				channel.setRateLimitPerUser(3);
		// 			});
		// 		channel.setPosition(0);

		// 	const Embed = new EmbedBuilder({
		// 		color: Colors.Blurple,
		// 		author: {
		// 			name: `${guild.name} | Ticket ID: ${Count}`,
		// 			iconURL: guild.iconURL()!,
		// 		},
		// 		fields: [
		// 			{
		// 				name: `Information`,
		// 				value: `\`-\` Provide as much details as possible!\n\`-\` Provide a reason for the ticket!`,
		// 			},
		// 		],
		// 	});
		// 	await channel.send({
		// 		embeds: [Embed],
		// 		components: [
		// 			new ActionRowBuilder<ButtonBuilder>().addComponents(
		// 				new ButtonBuilder({
		// 					custom_id: `close-ticket`,
		// 					label: "Close Ticket",
		// 					emoji: "⛔",
		// 					style: ButtonStyle.Danger,
		// 				})
		// 			),
		// 		],
		// 	});

		// 	await channel
		// 		.send({
		// 			content: `${member}`,
		// 		})
		// 		.then((message) => {
		// 			setTimeout(() => {
		// 				message.delete().catch(() => {});
		// 			}, 5 * 1000);
		// 		});

		// 	await i.reply({
		// 		content: `Your ticket has been created: ${channel}!`,
		// 		ephemeral: true,
		// 	});
		// });
	},
});
