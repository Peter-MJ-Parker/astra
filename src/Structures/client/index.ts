import { Client, InteractionCollector, Partials } from 'discord.js';
import { Sern } from '@sern/handler';
import type { useContainer } from '#Astra';
import { env } from '#utils';

export class ASTRA extends Client {
	constructor() {
		super({
			intents: 3276799,
			partials: [
				Partials.Channel,
				Partials.GuildMember,
				Partials.GuildScheduledEvent,
				Partials.Message,
				Partials.Reaction,
				Partials.ThreadMember,
				Partials.User,
			],
			shards: 'auto',
			allowedMentions: {
				repliedUser: false,
				users: [],
			},
		});
		this.token = env.DISCORD_TOKEN;
	}

	async start(container: typeof useContainer) {
		Sern.init({
			defaultPrefix: 'astra!',
			commands: 'dist/commands',
			events: 'dist/events',
			containerConfig: {
				get: container,
			},
		});
		this.setMaxListeners(0);
		await this.login(this.token!);
	}
}
