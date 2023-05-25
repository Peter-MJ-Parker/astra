import { logger } from '#utils';
import { EventType, eventModule } from '@sern/handler';
import type mongoose from 'mongoose';

export default eventModule({
	type: EventType.External,
	name: 'error',
	emitter: 'mongoose',
	plugins: [],
	execute(error: mongoose.Error) {
		logger().error(`[DATABASE] - Mongoose connection error: \n${error.stack}`);
	},
});
