import { publish } from '#plugins';
import { shorten } from '#utils';
import { commandModule, CommandType } from '@sern/handler';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js';

export default commandModule({
	type: CommandType.CtxUser,
	plugins: [publish({ dmPermission: false })],
	execute: async (interaction) => {
		await interaction.deferReply({ fetchReply: true, ephemeral: true });
		const user = interaction.targetUser;
		const member = await interaction.guild?.members.fetch(user.id)!;
		const pfp = member.displayAvatarURL();
		const animated = member.avatar?.startsWith('a_')!;
		let op = member.nickname ? member.nickname : member.user.username;
		const shortURL: string = await shorten(
			`https://lens.google.com/uploadbyurl?url=${pfp}`
		);

		const buttons = [
			button('png', pfp.toString()),
			button('jpg', pfp.toString()),
			button('webp', pfp.toString()),
			reverse(shortURL),
		];

		if (animated) {
			buttons.push(button('gif', pfp.toString()));
		}

		const row = new ActionRowBuilder<ButtonBuilder>();
		buttons.forEach((button) => {
			row.addComponents(button);
		});

		const avatarEmbed = new EmbedBuilder()
			.setAuthor({ name: `${op}'s avatar!` })
			.setImage(`${member.displayAvatarURL({ size: 4096 })}`);

		await interaction.editReply({
			embeds: [avatarEmbed],
			components: [row],
		});
	},
});
function button(type: string, url: string) {
	const ext = `.${url.split('/').pop()?.split('.').pop()}`;
	const newURL = `${url.replace(ext, `.${type}`)}`;
	return new ButtonBuilder({
		label: type,
		style: 5,
		url: newURL,
		type: 2,
	});
}
function reverse(url: string) {
	return new ButtonBuilder({
		label: 'Reverse Lookup',
		style: 5,
		url,
		type: 2,
	});
}
