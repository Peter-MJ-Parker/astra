import { model, Schema } from 'mongoose';

const name = 'ticketSetup';
export default model(
	name,
	new Schema({
		GuildID: String,
		ChannelID: String,
		TranscriptID: String,
		OpenCategoryID: String,
		ClosedCategoryID: String,
		ArchiveCategoryID: String,
		SupportRoleID: String,
	}),
	name
);
