import { getMeme } from "#utils";
import { commandModule, CommandType } from "@sern/handler";

export default commandModule({
  type: CommandType.Button,
  description: "",
  execute: async (interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId === "meme-next") {
        const meme = await getMeme();
        await interaction.deferUpdate();
        await interaction.message.edit({ embeds: [meme] });
      }
    }
  },
});
