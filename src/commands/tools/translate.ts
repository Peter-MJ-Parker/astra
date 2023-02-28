import { publish } from "#handler";
import { Translate } from "#utils";
import { commandModule, CommandType } from "@sern/handler";
import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";

export default commandModule({
  type: CommandType.CtxMsg,
  name: "translate",
  plugins: [publish()],
  execute: async (ctx) => {
    let msg = ctx.targetMessage;
    let msgId = ctx.targetId;

    const menu = new ActionRowBuilder<StringSelectMenuBuilder>({});

    await Translate("Hello", "cym");
  },
});
