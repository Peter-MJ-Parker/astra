import mongoose from 'mongoose';
import { reqBoolean, reqNumber, reqString } from '#handler';
const { model, Schema } = mongoose;

const name = 'antiroll';
export default model(
	name,
	new Schema({
		userId: reqString,
		pass: reqBoolean,
		expiry: reqNumber,
	}),
	name
);
