import { publish, requirePermission } from "#handler";
import { logger } from "#utils";
import { commandModule, CommandType } from "@sern/handler";
import {
	ApplicationCommandOptionType,
	ChannelType,
	Colors,
	EmbedBuilder,
} from "discord.js";

export default commandModule({
	type: CommandType.Slash,
	plugins: [
		publish(),
		requirePermission("both", ["ManageChannels", "ManageRoles"]),
	],
	description: "Setup server options in my database.",
	execute: async ({ interaction }) => {
		const embeds = [
			new EmbedBuilder({
				color: Colors.Blue,
				title: "Setup",
				description:
					"This menu will guide you through the different things you can setup. Not all are required. Select the System that you would like to setup.",
				fields: [
					{
						name: "Member Logging",
						value: "Setup member join and leaving.",
						inline: true,
					},
					{
						name: "Music System",
						value: "Setup member music system.",
						inline: true,
					},
					{
						name: "XP Logging",
						value: "Setup XP System.",
						inline: true,
					},
					{
						name: "Bot Spam Setup",
						value: "Setup member join and leaving.",
						inline: true,
					},
					{
						name: "Gaming System",
						value: "Setup gaming channels.",
						inline: true,
					},
					{
						name: "Ticket System",
						value: "Setup Ticket System",
						inline: true,
					},
				],
				footer: {
					text: "Administrative System",
				},
			}),
		];
		// const components = [

		// ];
		// await interaction.reply({
		// 	embeds,
		// 	components
		// })
	},
});
