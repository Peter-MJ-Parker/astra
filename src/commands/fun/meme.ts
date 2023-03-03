import { publish } from "#handler";
import { commandModule, CommandType } from "@sern/handler";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { getMeme } from "#utils";

export default commandModule({
  type: CommandType.Slash,
  plugins: [publish()],
  description: "Sends a meme in current channel",
  options: [],
  execute: async (ctx, options) => {
    const meme = await getMeme();

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("meme-next")
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Next Meme")
        .setEmoji("⏩")
    );

    ctx.reply({ embeds: [meme], components: [buttons] });
  },
});
