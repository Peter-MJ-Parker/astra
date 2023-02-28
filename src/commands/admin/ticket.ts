import { publish, requirePermission } from "#handler";
import { commandModule, CommandType } from "@sern/handler";
import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ButtonBuilder,
	ButtonStyle,
	CategoryChannel,
	ChannelType,
	Colors,
	EmbedBuilder,
	Guild,
	GuildMember,
	Role,
	TextChannel,
} from "discord.js";
import Tickets from "../../Structures/mongo/schemas/tickets/tickets.js";
import TicketSetup from "../../Structures/mongo/schemas/tickets/ticketSetup.js";
import TicketCount from "../../Structures/mongo/schemas/tickets/ticketCount.js";

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish(), requirePermission("both", ["ManageGuild"])],
	description: "Configure the ticket system.",
	options: [
		{
			name: "setup",
			description: "Setup the ticket system",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "channel",
					description: "Channel to send the ticket panel in.",
					type: ApplicationCommandOptionType.Channel,
					channel_types: [ChannelType.GuildForum],
					required: true,
				},
				{
					name: "transcript_channel",
					description: "The channel to send the transcripts in.",
					type: ApplicationCommandOptionType.Channel,
					channel_types: [ChannelType.GuildText],
					required: true,
				},
				{
					name: "open_category",
					description: "The category for open tickets.",
					type: ApplicationCommandOptionType.Channel,
					channel_types: [ChannelType.GuildCategory],
					required: true,
				},
				{
					name: "closed_category",
					description: "The category for closed tickets.",
					type: ApplicationCommandOptionType.Channel,
					channel_types: [ChannelType.GuildCategory],
					required: true,
				},
				{
					name: "archive_category",
					description: "The category for archived tickets.",
					type: ApplicationCommandOptionType.Channel,
					channel_types: [ChannelType.GuildCategory],
					required: true,
				},
				{
					name: "support_role",
					description: "The role to assign to support tickets.",
					type: ApplicationCommandOptionType.Role,
					required: true,
				},
			],
		},
		{
			name: "delete",
			description: "Delete the ticket config",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "options",
					description: `Chose an option to delete that data`,
					type: ApplicationCommandOptionType.String,
					choices: [
						{ name: `ticket setup`, value: `setup` },
						{ name: `tickets`, value: `tickets` },
						{ name: `ticket count`, value: `count` },
					],
				},
			],
		},
		{
			name: "remove-user",
			description: "Remove a user from the ticket",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "user",
					description: `Provide a user to manage`,
					type: ApplicationCommandOptionType.User,
				},
			],
		},
		{
			name: "add-user",
			description: "Add a user to the ticket",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "user",
					description: `Provide a user to manage`,
					type: ApplicationCommandOptionType.User,
				},
			],
		},
	],
	execute: async ({ interaction }, [, options]) => {
		const guild = interaction.guild as Guild;
		const member = interaction.member as GuildMember;
		const channel = interaction.channel as TextChannel;
		const i = interaction;

		const TicketsDB = await Tickets.findOne({ GuildID: guild.id });
		const TicketSetupDB = await TicketSetup.findOne({ GuildID: guild.id });
		const TicketCountDB = await TicketCount.findOne({ GuildID: guild.id });

		if (options.getSubcommand() === "setup") {
			if (TicketSetupDB)
				return i.reply({
					content: `> **Alert:** There is already a ticket system on this guild.`,
					ephemeral: true,
				});

			const Channel = options.getChannel("channel") as TextChannel;
			const TranscriptChannel = options.getChannel(
				"transcript_channel"
			) as TextChannel;
			const OpenCategory = options.getChannel(
				"open_category"
			) as CategoryChannel;
			const ClosedCategory = options.getChannel(
				"closed_category"
			) as CategoryChannel;
			const ArchiveCategory = options.getChannel(
				"archive_category"
			) as CategoryChannel;
			const SupportRole = options.getRole("support_role") as Role;

			await TicketSetup.findOneAndUpdate(
				{ GuildID: guild.id },
				{
					ChannelID: Channel.id,
					TranscriptID: TranscriptChannel.id,
					OpenCategoryID: OpenCategory.id,
					ClosedCategoryID: ClosedCategory.id,
					ArchiveCategoryID: ArchiveCategory.id,
					SupportRoleID: SupportRole.id,
				},
				{
					new: true,
					upsert: true,
				}
			);

			channel.send({
				embeds: [
					new EmbedBuilder({
						color: Colors.Yellow,
						description: `Press 📩 to Create a Ticket`,
					}),
				],
				components: [
					new ActionRowBuilder<ButtonBuilder>().addComponents(
						new ButtonBuilder({
							custom_id: `create-ticket`,
							emoji: "📩",
							style: ButtonStyle.Secondary,
						})
					),
				],
			});

			i.reply({
				content: `> **Alert:** Ticket System Setup completed!`,
				ephemeral: true,
			});
		}

		if (options.getSubcommand() === "remove-user") {
			const user = options.getMember("user") as GuildMember;
			const TicketDB = await Tickets.findOne({
				GuildID: guild.id,
				ChannelID: channel.id,
			});
			if (!TicketDB)
				return i.reply({
					content: `> **Alert:** This command can only be used in Tickets!`,
					ephemeral: true,
				});

			(interaction.channel as TextChannel).permissionOverwrites.edit(
				user.id!,
				{
					ViewChannel: false,
				}
			);

			await Tickets.findOneAndUpdate(
				{ GuildID: guild.id, ChannelID: channel.id },
				{ $pull: { MembersID: user.id } }
			);

			i.reply({
				content: `> **Alert:** You removed ${user}'s access for this ticket`,
				ephemeral: true,
			});
		}

		if (options.getSubcommand() === "add-user") {
			const user = options.getMember("user") as GuildMember;
			const TicketDB = await Tickets.findOne({
				GuildID: guild.id,
				ChannelID: channel.id,
			});
			if (!TicketDB)
				return i.reply({
					content: `> **Alert:** This command can only be used in Tickets!`,
					ephemeral: true,
				});

			(interaction.channel as TextChannel).permissionOverwrites.edit(
				user.id,
				{
					ViewChannel: true,
				}
			);

			await Tickets.findOneAndUpdate(
				{ GuildID: guild.id, ChannelID: channel.id },
				{ $push: { MembersID: user.id } }
			);

			i.reply({
				content: `> **Alert:** You added ${user}'s access for this ticket`,
				ephemeral: true,
			});
		}

		if (options.getSubcommand() === "delete") {
			const DelOptions = options.getString("options");

			switch (DelOptions) {
				case "setup": {
					if (!TicketSetupDB) {
						return i.reply({
							content: `> **Alert:** There is no data related to ticket setup.`,
							ephemeral: true,
						});
					} else {
						await TicketSetup.findOneAndDelete({
							GuildId: guild.id,
						});

						return i.reply({
							embeds: [
								new EmbedBuilder({
									color: Colors.Red,
									description: `Ticket setup has been deleted`,
								}),
							],
							ephemeral: true,
						});
					}
				}

				case "tickets": {
					if (!TicketsDB) {
						return i.reply({
							content: `> **Alert:** No tickets found to delete!`,
							ephemeral: true,
						});
					} else {
						await Tickets.deleteMany({ GuildID: guild.id });

						return i.reply({
							embeds: [
								new EmbedBuilder({
									color: Colors.Red,
									description: `Ticket setup has been deleted`,
								}),
							],
							ephemeral: true,
						});
					}
				}

				case "count": {
					if (!TicketCountDB) {
						return i.reply({
							content: `> **Alert:** No ticket count found to delete!`,
							ephemeral: true,
						});
					} else {
						await TicketCount.deleteMany({ GuildID: guild.id });

						return i.reply({
							embeds: [
								new EmbedBuilder({
									color: Colors.Red,
									description: `Ticket setup has been deleted`,
								}),
							],
							ephemeral: true,
						});
					}
				}
			}
		}
	},
});
