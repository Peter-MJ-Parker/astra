import { publish } from "#handler";
import { commandModule, CommandType } from "@sern/handler";

export default commandModule({
  type: CommandType.Slash,
  plugins: [publish()],
  description: "A ping command",
  execute: async ({ interaction }, [, options]) => {
    await interaction.reply("Pong 🏓");
  },
});
