import fs from 'fs';
import axios from 'axios';
import { EmbedBuilder } from 'discord.js';
import { load } from './load.js';
import { createRequire } from 'module';
import { useContainer } from '#Astra';
import fetch from 'node-fetch';
import urlShort from '#schemas/shortify/urlShort';

export const require = createRequire(import.meta.url);
export * from '../google/google.js';
export { welcomeCreate, IMPwelcomeCreate } from './WelcomeCanvas/welcome.js';
export const logger = () => useContainer('@sern/logger')[0];
export { badLinks, autoMute } from './badLinks.js';
export * from './WelcomeCanvas/gif.js';
export { presences } from './status.js';
export * from './Discord/Options.js';
export * from './Discord/Builders.js';

export const rds = fs.readdirSync;
export const env = load({
	DISCORD_TOKEN: String,
	CONNECT: String,
	defaultPrefix: String,
	GENIUS: String,
	SPOTIFY_CLIENT_ID: String,
	SPOTIFY_SECRET: String,
	GIPHY: String,
	ownerIDs: Array,
	GoogleID: String,
	GoogleAPI: String,
	SteamAPI: String,
	UrlAPI: String,
	UrlDomain: String,
	UrlGroup: String,
});

export function isPic(str: string, boolean: any) {
	if (boolean) return /\.(jpe?g|png|gif|webp)$/i.test(str);
	if (!boolean) return /\.(jpe?g|png|webp)$/i.test(str);
	else return false;
}

export async function getMeme() {
	let nonNSFW = null;

	while (nonNSFW === null) {
		const response = await axios.get('https://reddit.com/r/memes.json');
		const { data } =
			response.data.data.children[
				Math.floor(Math.random() * response.data.data.children.length)
			];
		if (data.over_18 === false) nonNSFW = data;
	}

	return new EmbedBuilder()
		.setColor('NotQuiteBlack')
		.setURL(`https://reddit.com${nonNSFW.permalink}`)
		.setTitle(nonNSFW.title)
		.setDescription(
			`🤖 **Sub-Reddit**: \`r/${nonNSFW.subreddit}\`\n⬆️ **Upvotes**: \`${nonNSFW.ups}\` - ⬇️ **Downvotes**: \`${nonNSFW.downs}\``
		)
		.setFooter({ text: `Meme by ${nonNSFW.author}` })
		.setImage(nonNSFW.url);
}

export function capitalise(string: string) {
	return string
		.split(' ')
		.map((str) => str.slice(0, 1).toUpperCase() + str.slice(1))
		.join(' ');
}

export function eventCapitalise(string: string) {
	return string
		.split(' ')
		.map((str) => str.slice(0, 1).toLowerCase() + str.slice(1))
		.join(' ');
}

export function prettyTime(milliseconds: number) {
	const seconds = Math.floor(milliseconds / 1000);
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);

	const timeArray = [];
	if (hrs > 0) timeArray.push(`\`${hrs}\` hour${hrs > 1 ? 's' : ' '}`);
	if (mins > 0) timeArray.push(`\`${mins}\` minute${mins > 1 ? 's' : ' '}`);
	if (secs > 0) timeArray.push(`\`${secs}\` second${secs > 1 ? 's' : ' '}`);

	return timeArray.join(', ');
}

export async function shorten(long_url: string) {
	let _exist = await urlShort.findOne({ longUrl: long_url });
	if (_exist) {
		return _exist.shortUrl;
	}
	const res = await fetch('https://api-ssl.bitly.com/v4/shorten', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.UrlAPI}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			long_url,
			domain: env.UrlDomain,
			group_guid: env.UrlGroup,
		}),
	});
	const body = await res.json();
	let id: string = body?.id!;
	let { link } = body;
	id = id.split('/').pop()!;
	await new urlShort({
		longUrl: long_url,
		shortUrl: link,
		urlCode: id,
		date: new Date(),
	}).save();
	console.log(body);
	return link;
}
