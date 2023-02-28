import { model, Schema } from "mongoose";
import { nonReqBoolean, nonReqString, reqString } from "../properties.js";

const name = "welcomeSetup";
export default model(
	name,
	new Schema({
		_id: Schema.Types.ObjectId,
		guildId: reqString,
		reaction: nonReqBoolean,
		canvas: {
			background: nonReqString,
			userPosition: reqString,
			welcomeTextColor: nonReqString,
			usernameColor: nonReqString,
			memberCountColor: nonReqString,
		},
	}),
	name
);
