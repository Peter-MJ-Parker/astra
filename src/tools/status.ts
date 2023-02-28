import type { Client, ClientPresenceStatus } from "discord.js";

export function presences(client: Client) {
	const gCount = client.guilds?.cache.size.toString();
	const uCount = client.users.cache.filter((m) => !m.bot).size;
	let acts = [
		{
			name: `over ${gCount} guild(s).`,
			type: 3,
			status: "online",
		},
		{
			name: "/commands",
			type: 5,
			status: "dnd",
		},
		{
			name: `over ${uCount} user(s).`,
			type: 3,
			status: "online",
		},
	];
	setInterval(async () => {
		const currentAct = acts.shift()!;
		client.user!.setPresence({
			activities: [
				{
					name: currentAct.name.toString(),
					type: currentAct.type,
				},
			],
			status: currentAct.status as ClientPresenceStatus,
		});
		acts.push(currentAct);
	}, 15000);
}
