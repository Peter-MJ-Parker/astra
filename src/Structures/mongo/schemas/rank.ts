import { model, Schema } from "mongoose";
import { nonReqBoolean, nonReqString, reqNumber, reqString } from "#handler";

export default model(
	"rank",
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
	"rank"
);
