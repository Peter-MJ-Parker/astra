import { model, Schema } from "mongoose";
import { nonReqString, reqString } from "#handler";

const name: string = "guild";
export default model(
	name,
	new Schema({
		name: reqString,
		guildId: reqString,
		verified_role: nonReqString,
		supportRole: nonReqString,
		muteRole: nonReqString,
		welcome_channel: nonReqString,
		leaving_channel: nonReqString,
		bot_spam_channel: nonReqString,
		music_channel: {
			text: nonReqString,
			voice: nonReqString,
		},
		dj_roles: {
			admin: nonReqString,
			moderator: nonReqString,
			dj: nonReqString,
		},
	}),
	name
);
