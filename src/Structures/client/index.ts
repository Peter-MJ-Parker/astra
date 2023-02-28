import { Client, Partials, Collection } from "discord.js";
import { Sern } from "@sern/handler";
import { env } from "#utils";
import type { useContainer } from "#Astra";
const { DISCORD_TOKEN, defaultPrefix } = env;

export class ASTRA extends Client {
	static games: Collection<string, any>;
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
		});
		this.token = DISCORD_TOKEN;
	}

	async start(container: typeof useContainer) {
		Sern.init({
			defaultPrefix,
			commands: "dist/commands",
			events: "dist/events",
			containerConfig: {
				get: container,
			},
		});

		this.login(this.token!);
	}
}
