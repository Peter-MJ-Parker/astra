import { publish } from "#handler";
import { languages } from "#utils";
import { commandModule, CommandType } from "@sern/handler";
import {
  ActionRowBuilder,
  ComponentType,
  StringSelectMenuBuilder,
} from "discord.js";

export default commandModule({
  type: CommandType.CtxMsg,
  name: "translate",
  plugins: [publish()],
  execute: async (ctx) => {
    let msg = ctx.targetMessage;
    let msgId = ctx.targetId;
    // let arr: object[] = [];
    let langs = Object.entries(languages);
    // for (const [k, v] of langs) {
    //   arr.push({ name: k, value: v });
    // }
    const filtered = langs.filter((k, v) => {
      return { k, v };
    });
    let options;
    if (filtered.length > 25) {
      options = filtered.slice(0, 25);
    } else {
      options = filtered;
    }

    console.log(options);
    const menu = new ActionRowBuilder<StringSelectMenuBuilder>({
      components: [
        new StringSelectMenuBuilder({
          custom_id: "translate-menu",
          type: ComponentType.StringSelect,
          max_values: 1,
          min_values: 1,
          placeholder:
            "Select the language you would like to translate the message to.",
          options: options.map((lang) => {
            return {
              label: lang[0].toString(),
              value: lang[1].toString(),
              description: `Translate the message to: ${lang[0].toString()}`,
            };
          }),
        }),
      ],
    });

    await ctx.reply({
      components: [menu],
      ephemeral: true,
    });
  },
});
