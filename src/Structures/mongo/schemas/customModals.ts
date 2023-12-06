import { model, Schema } from 'mongoose';
import { reqString } from '#handler';

const name = 'custom-modals';
export default model(
	name,
	new Schema({
		guildId: reqString,
		channelId: reqString,
	}),
	name
);
