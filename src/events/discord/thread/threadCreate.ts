import { EventType, eventModule } from '@sern/handler';
import { type AnyThreadChannel, Events } from 'discord.js';

export default eventModule({
	type: EventType.Discord,
	name: Events.ThreadCreate,
	execute: async (thread: AnyThreadChannel, newlyMade: boolean) => {
		// console.log(thread);
	},
});
