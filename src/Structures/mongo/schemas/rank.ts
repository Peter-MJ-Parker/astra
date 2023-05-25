import mongoose from 'mongoose';
import { nonReqBoolean, nonReqString, reqNumber, reqString } from '#handler';
const { model, Schema } = mongoose;

const name = 'rank';
export default model(
	name,
	new Schema({
		guildId: reqString,
		userId: reqString,
		level: reqNumber,
		xp: reqNumber,
		leaderboard: {},
		rankOptions: [
			{
				background: nonReqString,
				color: nonReqString,
			},
		],
	}),
	name
);
