// @ts-nocheck
/**
 * This is OwnerOnly plugin, it allows only bot owners to run the command, like eval.
 * Users should import their own env!
 * ts-dotenv is incompatible with this because it doesn't support arrays but users can still use dotenv
 * Some modifications are required for this plugin to work for end-users.
 *
 * @author @EvolutionX-10 [<@697795666373640213>]
 * @author @Peter-MJ-Parker [<@1017182455926624316>]
 * @version 2.0.0
 * @example
 * ```ts
 * import { ownerOnly } from "../plugins/ownerOnly";
 * import { commandModule } from "@sern/handler";
 * export default commandModule({
 *  plugins: [ ownerOnly() ],  // if no id is present, it will fallback to config defined below.
 *  execute: (ctx) => {
 * 		//your code here
 *  }
 * })
 * ```
 */

import { CommandType, CommandControlPlugin, controller } from '@sern/handler';
import { env } from '#utils';
export function ownerOnly(owners?: string[]) {
	return CommandControlPlugin<CommandType.Both>(async (ctx, args) => {
		const [config] = env.ownerIDs;
		if (!owners) {
			if (!config || config.length < 1) {
				let app = await ctx.client.application?.fetch();
				if (ctx.user.id === app?.owner?.id) {
					switch (args[0]) {
						case 'slash':
							await ctx.interaction.reply({
								content:
									'Make sure your ID is set in environemnt!',
								ephemeral: true,
							});
							break;
						case 'text':
							ctx.message
								.reply({
									content:
										'Make sure your ID is set in environemnt!',
								})
								.then((m) => {
									setTimeout(async () => {
										await m.delete();
										await ctx.message.delete();
									}, 5000);
								});
							break;
						default:
							break;
					}
					throw new Error(
						`Please set your ownerIDs in your env/config file.`
					);
				}

				return controller.stop(); //! Important: It stops the execution of command!
			} else owners = config;
			console.log(owners);
		}
		if (owners && owners.includes(ctx.user.id)) return controller.next();
		await ctx.reply('Only owner can run it!!!');
		return controller.stop(); //! Important: It stops the execution of command!
	});
}
