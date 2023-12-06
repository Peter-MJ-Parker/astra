import type { Client, ClientPresenceStatus, User } from 'discord.js';

export async function presences(client: Client) {
	const owner = await client.users.fetch(
		(
			await client.application!.fetch()
		).owner as User
	);
	const gCount = client.guilds?.cache.size;
	const uCount = client.users.cache.filter((m) => !m.bot).size;
	let newName: string = '';
	if (gCount < 2) {
		newName += `over ${gCount} guild.`;
	} else newName = `over ${gCount} guilds.`;
	let acts = [
		{
			name: 'sern bots',
			type: 3,
			status: 'online',
		},
		{
			name: `${owner.tag}`,
			type: 2,
			status: 'listening',
		},
		{
			name: newName,
			type: 3,
			status: 'online',
		},
		{
			name: '/commands',
			type: 5,
			status: 'dnd',
		},
		{
			name: `over ${uCount} user(s).`,
			type: 3,
			status: 'online',
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
	}, 60000);
}
