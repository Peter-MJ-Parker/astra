import { commandModule, CommandType } from "@sern/handler";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Colors,
	EmbedBuilder,
	Guild,
	GuildMember,
	TextChannel,
} from "discord.js";
import Tickets from "../../../../Structures/mongo/schemas/tickets/tickets.js";
import TicketSetup from "../../../../Structures/mongo/schemas/tickets/ticketSetup.js";

export default commandModule({
	type: CommandType.Button,
	name: "archive-ticket",
	description: "Archives a ticket.",
	execute: async (interaction) => {
		const guild = interaction.guild as Guild;
		const member = interaction.member as GuildMember;
		const channel = interaction.channel as TextChannel;
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
				content: `> **Alert:** Ticket has been deleted, can't use any actions.`,
				ephemeral: true,
			});

		if (TicketsDB.Archived == true)
			return i.reply({
				content: `> **Alert:** Ticket already archived`,
				ephemeral: true,
			});

		await i.reply({
			content: `> **Alert:** You archived the ticket`,
			ephemeral: true,
		});

		channel.send({
			embeds: [
				new EmbedBuilder({
					color: Colors.Red,
					description: `Ticket archived by ${member}.`,
				}),
			],
		});
		const supportpanel = await channel.send({
			embeds: [
				new EmbedBuilder({
					color: 303135,
					description: `
              \`-\` Want to open the ticket again after you closed it press re-open
              \`-\` Want to delete the ticket press "Delete"!
              `,
				}),
			],
			components: [
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder({
						custom_id: `reopen-ticket`,
						label: `Re-open Ticket`,
						emoji: "💬",
						style: ButtonStyle.Success,
					}),
					new ButtonBuilder({
						custom_id: `delete-ticket`,
						label: `Delete Ticket`,
						emoji: "⛔",
						style: ButtonStyle.Danger,
					})
				),
			],
		});

		channel.edit({ parent: TicketSetupDB.ArchiveCategoryID! });
		// message.delete(TicketsDB.MessageID);

		await Tickets.findOneAndUpdate(
			{
				ChannelID: channel.id,
			},
			{ Archived: true, MessageID: supportpanel.id }
		);
	},
});
