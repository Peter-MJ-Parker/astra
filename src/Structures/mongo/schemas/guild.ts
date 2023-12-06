import mongoose from 'mongoose';
import { nonReqBoolean, nonReqString, reqString } from '#handler';
const { model, Schema } = mongoose;

const name: string = 'guild';
export default model(
	name,
	new Schema({
		name: reqString,
		guildId: reqString,
		memberAdd: {
			reaction: nonReqBoolean,
			message: {
				channelId: nonReqString,
				messageId: nonReqString,
				emoji: nonReqString,
			},
			messageEdit: {
				channelId: nonReqString,
				messageId: nonReqString,
			},
		},
		verified_role: nonReqString,
		supportRole: nonReqString,
		muteRole: nonReqString,
		welcome_channel: nonReqString,
		leaving_channel: nonReqString,
		bot_spam_channel: nonReqString,
		logChannel: nonReqString,
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
