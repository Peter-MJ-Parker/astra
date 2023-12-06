import { model, Schema } from 'mongoose';
import { reqString } from '#handler';

const name = `translations`;
export default model(
	name,
	new Schema({
		userId: reqString,
		language: reqString,
	}),
	name
);
