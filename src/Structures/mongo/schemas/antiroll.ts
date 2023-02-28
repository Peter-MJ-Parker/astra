import { model, Schema } from "mongoose";
import { reqBoolean, reqNumber, reqString } from "#handler";

const name = "antiroll";
export default model(
	name,
	new Schema({
		userId: reqString,
		pass: reqBoolean,
		expiry: reqNumber,
	}),
	name
);
