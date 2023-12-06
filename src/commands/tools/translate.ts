import { publish } from "#plugins";
import { langs } from "#utils";
import { commandModule, CommandType } from "@sern/handler";
import { useContainer } from "#Astra";

export default commandModule({
	type: CommandType.CtxMsg,
	name: "translate",
	plugins: [publish()],
	execute: async (ctx) => {
		await ctx.deferReply({ fetchReply: true, ephemeral: true });

		const [Google] = useContainer("Google");
		let msg = ctx.targetMessage;
		let msgId = ctx.targetId;
		if (!msg.content) {
			return await ctx.editReply({
				content: "That message has no `content`!",
			});
		}
		let result = await Google.translate(msg.cleanContent, "cy");

		await ctx.editReply({
			embeds: [result],
		});
	},
});
