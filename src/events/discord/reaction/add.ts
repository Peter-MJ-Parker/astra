import { welcomeCreate } from '#utils';
import { discordEvent } from '@sern/handler';
import {
	EmbedBuilder,
	Events,
	GuildMember,
	Role,
	TextChannel,
} from 'discord.js';
import guildSchema from '#schemas/guild';

export default discordEvent({
	name: Events.MessageReactionAdd,
	async execute(reaction, user) {
		let message = reaction.message;
		let Guild = await guildSchema.findOne({ guildId: message.guildId });
		const msg = Guild?.memberAdd?.message?.messageId;
		const _msg = Guild?.memberAdd?.message!;
		const msgToEdit = await (
			(await message.guild?.channels.fetch(_msg.channelId!)) as TextChannel
		).messages.fetch(_msg.messageId!);
		const memberId = msgToEdit.embeds[0].fields[1].value;
		const member = message.guild?.members.cache.get(memberId) as GuildMember;
		const amount = member.guild.members.cache.filter(
			(m) => m.user.bot === false
		).size;
		const welcomeChannel = message.guild?.channels.cache.get(
			'763256419868475444'
		) as TextChannel;

		if (message.partial) await message.fetch();
		if (reaction.partial) await reaction.fetch();

		if (user.bot) return;
		if (!reaction.message.guild) return;

		if (message.guildId === '678398938046267402') {
			if (message.id === '744940669834887218' && reaction.emoji.toString()) {
				let lilbud = message.guild?.roles.cache.get(
					'678400106982277130'
				) as Role;
				if (!member.roles.cache.has(lilbud.id)) {
					await member.roles.add(lilbud).catch((err) => console.log(err));
					await message.channel
						.send(
							`${member}, You may now go to the <#744927896187043940> and introduce yourself!`
						)
						.then((m) => {
							setTimeout(() => {
								m.delete().catch((err) => {
									console.log(
										"Regular Error. Couldn't Delete the message.\n" + err
									);
								});
							}, 5 * 1000);
						});
					await welcomeCreate(
						member,
						member.guild.name,
						amount,
						welcomeChannel
					);
				} else return null;
			}
		} else {
			let _emoji = _msg.emoji;
			let emoName: string;
			if (_emoji.startsWith('<') && _emoji.endsWith('>')) {
				emoName = _emoji
					.replace('<:', '')
					.replace('>', '')
					.split(':')[0]
					.toString();
			} else {
				emoName = _emoji;
			}
			if (message.id === msg && reaction.emoji.toString()) {
				if (reaction.emoji.name === emoName) {
					let embed = msgToEdit.embeds[0];
					EmbedBuilder.from(embed).setFields(
						{ name: 'ID', value: user.id },
						{ name: 'Verification: ', value: `✔ Successful!` }
					);
					msgToEdit.edit({ components: [] });
					welcomeCreate(member, member.guild.name, amount, welcomeChannel);
				} else {
					await message.react('❌').then((r) =>
						setTimeout(async () => {
							await reaction.remove();
							await r.remove();
						}, 3000)
					);
				}
			}
		}
	},
});
