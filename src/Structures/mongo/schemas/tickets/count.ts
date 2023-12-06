import { model, Schema } from 'mongoose';

const name = 'ticketCount';
export default model(
	name,
	new Schema({
		GuildID: String,
		TicketCount: String,
	}),
	name
);
