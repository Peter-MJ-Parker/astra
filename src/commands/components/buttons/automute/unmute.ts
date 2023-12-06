import { commandModule, CommandType } from "@sern/handler";

export default commandModule({
	type: CommandType.Button,
	name: "automute-unmute",
	description: "Allows a user to appeal their mute.",
	execute: async (ctx) => {},
});
