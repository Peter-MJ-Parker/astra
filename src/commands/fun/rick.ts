import { publish } from "#handler";
import { env } from "#utils";
import { commandModule, CommandType } from "@sern/handler";
import type { TextChannel } from "discord.js";
import db from "../../Structures/mongo/schemas/antiroll.js";

export default commandModule({
  type: CommandType.Slash,
  plugins: [publish()],
  description: "Sends a rickroll anonymously",
  execute: async (ctx, [, options]) => {
    const url = `https://g.tenor.com/v1/search?q=rick+roll&key=${env.GoogleAPI}&limit=1`;
    await fetch(url, { method: "GET" })
      .then(async (res) => {
        let data = await res.json();
        console.log(data.results[0].url);
        await ctx.reply({
          content: "Sent your request!",
          ephemeral: true,
        });
        (ctx.channel as TextChannel)?.send({
          content: `${data.results[0].url}`,
        });
      })
      .catch(() => {
        ctx.reply({
          content:
            "I couldn't find that image. Please contact my developer! @marv#8280",
        });
      });
  },
});
