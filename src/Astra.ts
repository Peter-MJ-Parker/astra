import { ASTRA } from '#client';
import { Sern, type Dependencies, type Singleton, single } from '@sern/handler';
import { Sparky } from '#handler';
import mongoose from 'mongoose';
import { Google } from '#utils';

export const client = new ASTRA();

interface MyDependencies extends Dependencies {
	'@sern/client': Singleton<ASTRA>;
	'@sern/logger': Singleton<Sparky>;
	mongoose: Singleton<mongoose.Connection>;
	Google: Singleton<Google>;
}

export const useContainer = Sern.makeDependencies<MyDependencies>({
	build: (root) =>
		root
			.add({ '@sern/client': single(() => client) })
			.upsert({
				'@sern/logger': single(() => new Sparky('debug', 'highlight')),
			})
			.add({ mongoose: single(() => mongoose.connection) })
			.add({ Google: single(() => new Google()) }),
});
client.start(useContainer);
