import { publish } from "#handler";
import { logger } from "#utils";
import { commandModule, CommandType } from "@sern/handler";
import { ApplicationCommandOptionType } from "discord.js";
import db from "../../Structures/mongo/schemas/rank.js";

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: "Shows a users rank (per guild).",
	options: [
		{
			name: "user",
			description: "Select a user to display their rank.",
			type: ApplicationCommandOptionType.User,
		},
	],
	execute: async ({ interaction }, [, options]) => {},
});
