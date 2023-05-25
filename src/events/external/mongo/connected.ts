import { useContainer } from '#Astra';
import { logger } from '#utils';
import { EventType, eventModule } from '@sern/handler';
const [mongoose] = useContainer('mongoose');

export default eventModule({
	type: EventType.External,
	name: 'connected',
	emitter: 'mongoose',
	plugins: [],
	execute() {
		logger().success(
			`[DATABASE] - Mongoose has successfully connected to: ${mongoose.name}`
		);
	},
});
