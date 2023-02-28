import { model, Schema } from "mongoose";

const name = "tickets";
export default model(
	name,
	new Schema({
		GuildID: String,
		ChannelID: String,
		TicketID: String,
		CreatorID: String,
		CreatorTag: String,
		MembersID: [String],
		CreatedAt: String,
		Deleted: Boolean,
		Closed: Boolean,
		Archived: Boolean,
		MessageID: String,
	}),
	name
);
