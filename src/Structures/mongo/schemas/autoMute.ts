import { model, Schema } from "mongoose";
import {
	nonReqBoolean,
	nonReqString,
	reqBoolean,
	reqNumber,
	reqString,
} from "#handler";

const name = "autoMute";
export default model(
	name,
	new Schema({
		guildId: reqString,
		guildName: reqString,
		muteRole: reqString,
		moderatorRole: reqString,
		threadChan: reqString,
		threads: [
			{
				memberId: reqString,
				activeThread: reqBoolean,
				threadId: nonReqString,
				embed0: nonReqString,
				embed1: nonReqString,
			},
		],
	}),
	name
);
