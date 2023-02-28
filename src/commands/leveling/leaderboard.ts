import { publish } from "#handler";
import { logger } from "#utils";
import { commandModule, CommandType } from "@sern/handler";
import { ApplicationCommandOptionType } from "discord.js";

export default commandModule({
  type: CommandType.Slash,
  plugins: [],
  description: "Shows the leaderboard per guild or overall.",
  options: [
    {
      name: "location",
      description: "Select which leaderboard you would like to see.",
      type: ApplicationCommandOptionType.String,
      choices: [
        { name: "Current Guild", value: "guild" },
        { name: "Overall", value: "global" },
      ],
    },
    {
      name: "limit",
      description: "How many users to see in the leaderboard.",
      type: ApplicationCommandOptionType.Number,
      choices: [
        { name: "5", value: "5" },
        { name: "10", value: "10" },
        { name: "15", value: "15" },
        { name: "20", value: "20" },
        { name: "25", value: "25" },
      ],
    },
  ],
  execute: async (ctx, [, options]) => {
    let location = options.getString("location") || "guild";
    let limit = options.getNumber("limit") || 10;
  },
});
