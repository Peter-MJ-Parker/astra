import { commandModule, CommandType } from "@sern/handler";
import { EmbedBuilder } from "discord.js";

export default commandModule({
  type: CommandType.StringSelect,
  name: "translate-menu",
  execute: async (ctx) => {
    const [toLang] = ctx.values;
    console.log(toLang);

    if (ctx.message.embeds) {
    }
    const embed = new EmbedBuilder({});
  },
});
