import { commandModule, CommandType } from "@sern/handler";
import {
	EmbedBuilder,
	Guild,
	GuildMember,
	Message,
	TextChannel,
} from "discord.js";
import Tickets from "../../../../Structures/mongo/schemas/tickets/tickets.js";
import TicketSetup from "../../../../Structures/mongo/schemas/tickets/ticketSetup.js";

export default commandModule({
	type: CommandType.Button,
	name: "reopen-ticket",
	description: "Reopens a closed ticket.",
	execute: async (interaction) => {
		const channel = interaction.channel as TextChannel;
		const guild = interaction.guild as Guild;
		const member = interaction.member as GuildMember;
		const message = interaction.message as Message;
		const i = interaction;

		const TicketSetupDB = await TicketSetup.findOne({
			GuildId: guild.id,
		});
		if (!TicketSetupDB)
			return i.reply({
				embeds: [
					new EmbedBuilder({
						color: 303135,
						description: `Can't find any data on the ticket system`,
					}),
				],
				ephemeral: true,
			});

		const TicketsDB = await Tickets.findOne({
			GuildId: guild.id,
			ChannelID: channel.id,
		});
		if (!TicketsDB)
			return i.reply({
				embeds: [
					new EmbedBuilder({
						color: 303135,
						description: `Can't find any data on the ticket system`,
					}),
				],
				ephemeral: true,
			});

		if (
			!member.roles.cache.find(
				(r) => r.id === TicketSetupDB.SupportRoleID
			)
		)
			return i.reply({
				embeds: [
					new EmbedBuilder({
						color: 303135,
						description: `You're not allowed to use this action!`,
					}),
				],
				ephemeral: true,
			});

		if (TicketsDB.Deleted == true)
			return i.reply({
				content: `> **Alert:** Ticket has deleted can't use any actions`,
				ephemeral: true,
			});

		if (TicketsDB.Closed == false)
			return i.reply({
				content: `> **Alert:** Ticket already open`,
				ephemeral: true,
			});

		await i.reply({
			content: `> **Alert:** You opened the ticket`,
			ephemeral: true,
		});

		channel.send({
			embeds: [
				new EmbedBuilder()
					.setColor("Green")
					.setDescription(`Ticket re-opened by ${member}.`),
			],
		});

		channel.edit({ parent: TicketSetupDB.OpenCategoryID! });
		// message.delete(TicketsDB.MessageID);
		TicketsDB.MembersID.forEach((m) => {
			channel.permissionOverwrites.edit(m, {
				ViewChannel: true,
				SendMessages: true,
				ReadMessageHistory: true,
			});
		});

		await Tickets.findOneAndUpdate(
			{
				ChannelID: channel.id,
			},
			{ Closed: false, Archived: false }
		);
	},
});
