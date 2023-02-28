import { commandModule, CommandType } from "@sern/handler";
import {
	Colors,
	EmbedBuilder,
	Guild,
	GuildMember,
	TextChannel,
} from "discord.js";
import Tickets from "../../../../Structures/mongo/schemas/tickets/tickets.js";
import TicketSetup from "../../../../Structures/mongo/schemas/tickets/ticketSetup.js";
import TicketCount from "../../../../Structures/mongo/schemas/tickets/ticketCount.js";
import { createTranscript, ExportReturnType } from "discord-html-transcripts";

export default commandModule({
	type: CommandType.Button,
	name: "delete-ticket",
	description: "Deletes a ticket.",
	execute: async (interaction) => {
		const channel = interaction.channel as TextChannel;
		const guild = interaction.guild as Guild;
		const member = interaction.member as GuildMember;
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

		const TicketCountDB = TicketCount.findOne({ GuildID: guild.id });
		const Count = (await TicketCountDB.countDocuments()).toString();

		const TChannel = guild.channels.cache.get(
			TicketSetupDB.TranscriptID!
		) as TextChannel;

		const attachment = await createTranscript(channel, {
			limit: -1,
			returnType: ExportReturnType.Attachment,
			saveImages: true,
			filename: `Ticket-${TicketsDB.CreatorTag}-${Count}.html`,
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
				content: `> **Alert:** Ticket already deleted`,
				ephemeral: true,
			});

		await i.reply({
			content: `> **Alert:** You deleted the ticket`,
			ephemeral: true,
		});

		await Tickets.findOneAndUpdate(
			{
				ChannelID: channel.id,
			},
			{ Closed: true, Deleted: true, Archived: true }
		);

		channel.send({
			embeds: [
				new EmbedBuilder({
					color: Colors.Red,
					description: `Ticket will be deleted in \`5\` seconds!`,
				}),
			],
		});

		TicketsDB.MembersID.forEach((m) => {
			channel.permissionOverwrites.edit(m, {
				ViewChannel: false,
				SendMessages: false,
				ReadMessageHistory: false,
			});
		});

		TChannel.send({
			embeds: [
				new EmbedBuilder({
					color: Colors.Blurple,
					description: `__Data:__
            \`-\` **Ticket ID:** ${Count}
            \`-\` **Ticket Creator ID:** ${TicketsDB.CreatorID}
            \`-\` **Ticket Creator:** ${TicketsDB.CreatorTag}
            \`-\` **Ticket Created at:** ${TicketsDB.CreatedAt}
            \`-\` **Closed By:** ${member}`,
					footer: {
						text: `Created at ${TicketsDB.CreatedAt}`,
						iconURL: guild.iconURL()!,
					},
				}),
			],
			files: [attachment],
		});
		setTimeout(async () => {
			await Tickets.findOneAndDelete({
				GuildID: guild.id,
				ChannelID: channel.id,
			}).catch((err) => console.log(err));

			channel.delete();
		}, 5 * 1000);
	},
});
