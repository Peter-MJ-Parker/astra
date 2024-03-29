import { logger } from '#utils';
import { EventType, eventModule } from '@sern/handler';
import pkg from 'mongoose';

export default eventModule({
	type: EventType.External,
	name: 'disconnected',
	emitter: 'mongoose',
	plugins: [],
	execute() {
		logger().warning(
			`[DATABASE] - Mongoose lost connection to: ${pkg.connection.host}`
		);
	},
});
