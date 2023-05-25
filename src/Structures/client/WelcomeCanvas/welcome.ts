import { createCanvas, loadImage, registerFont, CanvasPattern } from 'canvas';
import {
	ActionRowBuilder,
	AttachmentBuilder,
	ButtonBuilder,
	ButtonStyle,
	GuildMember,
	TextChannel,
} from 'discord.js';
import guildSchema from '#schemas/guild';
import welcomeSchema from '#schemas/welcomeSetup';

export async function welcomeCreate(
	member: GuildMember,
	guildName: string,
	memberCount: number,
	channel: TextChannel
) {
	registerFont(
		`./src/Structures/client/WelcomeCanvas/fonts/AlfaSlabOne-Regular.ttf`,
		{
			family: 'Alfa',
		}
	);
	registerFont(
		`./src/Structures/client/WelcomeCanvas/fonts/LobsterTwo-BoldItalic.ttf`,
		{
			family: 'Lobster',
		}
	);
	const defaultColor = '#f7e3e1';
	let guild = await guildSchema.findOne({ id: member.guild.id });
	let config = await welcomeSchema.findOne({ guildId: guild?.id });
	let colors = {
		welcome: config?.canvas?.welcomeTextColor!,
		member: config?.canvas?.usernameColor!,
		membercount: config?.canvas?.memberCountColor!,
	};

	const welcomeCanvas = createCanvas(1024, 500);
	const ctx = welcomeCanvas.getContext('2d');
	ctx.font = '68px "Alfa"';
	ctx.fillStyle = colors.welcome ?? defaultColor;

	const url = 'https://i.imgur.com/KoJFmQW.jpeg';
	const background = config?.canvas?.background || url;
	await loadImage(url).then(async (img) => {
		ctx.drawImage(img, 0, 0, 1024, 500);
		ctx.fillText('Welcome!', 350, 75);
		ctx.beginPath();
		ctx.arc(512, 245, 128, 0, Math.PI * 2, true);
		ctx.stroke();
		ctx.fill();
	});

	let canvas = welcomeCanvas;
	ctx.font = '52px Lobster';
	ctx.textAlign = 'center';
	ctx.fillText(member.user.tag.toUpperCase(), 512, 425);
	ctx.font = '38px Lobster';
	ctx.fillText(`${memberCount} members`, 512, 475);
	ctx.beginPath();
	ctx.arc(512, 245, 119, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();
	let url2 = member.displayAvatarURL();
	if (url2.endsWith('webp')) {
		url2 = url2.replace('.webp', '.png');
	}
	console.log(url2);
	await loadImage(`${url2}`).then((img2) => {
		ctx.drawImage(img2, 393, 125, 238, 238);
	});
	let Attachment = [
		new AttachmentBuilder(canvas.toBuffer(), {
			name: `welcome-${member.id}.png`,
			description: `test`,
		}),
	];
	let button = [
		new ActionRowBuilder<ButtonBuilder>({
			type: 1,
			components: [
				new ButtonBuilder({
					type: 2,
					label: ` Wave to say hi!`,
					emoji: `🙌`,
					custom_id: 'welcome-wave',
					style: ButtonStyle.Secondary,
				}),
			],
		}),
	];

	const contents = [
		`:wave: Welcome to ${guildName}, ${member}`,
		`We hope you find what you're looking for and that you enjoy your stay, ${member}.`,
		`${member} is here to kick ass and chew gum, but ${member} has run out of gum.`,
		`${member} has just joined. Save your bananas.`,
		`Welcome ${member}. Please leave your negativity at the door.`,
		`It's a bird! It's a plane! Nevermind it's just ${member}.`,
		`${member} has joined the server. Can I get a heal?`,
		`${member} has arrived. The party is over.`,
		`${member} has arrived. The party has started.`,
		`Welcome ${member}! We were waiting for you (͡ ° ͜ʖ ͡ °)`,
		`${member} never gonna let you down, ${member} never gonna give you up.`,
		`Hi ${member}! Welcome to our community! Please make yourself at home!`,
	];
	let option = Math.floor(Math.random() * contents.length);
	const content = contents[option];

	try {
		channel.send({
			content,
			files: Attachment,
			components: button,
		});
	} catch (error) {
		console.log(error);
	}
}

export async function IMPwelcomeCreate(
	member: GuildMember,
	guildName: string,
	channel: TextChannel
) {
	const defaultColor = '#f7e3e1';
	const welcomeCanvas = createCanvas(1024, 500);
	const ctx = welcomeCanvas.getContext('2d');
	ctx.font = '68px Uni Sans Heavy';
	ctx.fillStyle = defaultColor;

	const url = 'https://imgur.com/quwRvGt.png';
	await loadImage(url).then(async (img) => {
		ctx.drawImage(img, 0, 0, 1024, 500);
		ctx.fillText('Welcome', 25, 100);
	});

	let canvas = welcomeCanvas;
	ctx.font = '52px Uni Sans Heavy';
	ctx.textAlign = 'center';
	ctx.fillText(member.user.tag, 850, 100);
	let files = [
		new AttachmentBuilder(canvas.toBuffer(), {
			name: `welcome-${member.id}.png`,
			description: `test`,
		}),
	];

	const contents = [
		`:wave: Welcome to ${guildName}, ${member}`,
		`We hope you find what you're looking for and that you enjoy your stay, ${member}.`,
		`${member} is here to kick ass and chew gum, but ${member} has run out of gum.`,
		`${member} has just joined. Save your bananas.`,
		`Welcome ${member}. Please leave your negativity at the door.`,
		`It's a bird! It's a plane! Nevermind it's just ${member}.`,
		`${member} has joined the server. Can I get a heal?`,
		`${member} has arrived. The party is over.`,
		`${member} has arrived. The party has started.`,
		`Welcome ${member}! We were waiting for you (͡ ° ͜ʖ ͡ °)`,
		`${member} never gonna let you down, ${member} never gonna give you up.`,
		`Hi ${member}! Welcome to our community! Please make yourself at home!`,
	];
	let option = Math.floor(Math.random() * contents.length);
	const content = contents[option];

	try {
		channel
			.send({
				content,
				files,
			})
			.then(async (m) => {
				await m.react('👋');
			});
	} catch (error) {
		console.log(error);
	}
}
