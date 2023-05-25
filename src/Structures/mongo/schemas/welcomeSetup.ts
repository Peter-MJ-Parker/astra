import mongoose from 'mongoose';
import { nonReqBoolean, nonReqString, reqString } from '../properties.js';
const { model, Schema } = mongoose;

const name = 'welcomeSetup';
export default model(
	name,
	new Schema({
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
