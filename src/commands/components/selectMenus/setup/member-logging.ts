import { commandModule, CommandType } from "@sern/handler";
import { publish } from "#handler";
import { ActionRowBuilder, ChannelSelectMenuBuilder } from "discord.js";

export default commandModule({
	type: CommandType.ChannelSelect,
	name: "member-logging",
	plugins: [],
	description: "Setup my options in your server.",
	execute: async (ctx) => {
		const menu = new ActionRowBuilder<ChannelSelectMenuBuilder>({
			components: [],
		});
	},
});
