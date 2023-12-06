import mongoose from 'mongoose';
const { model, Schema } = mongoose;

const name = 'url_uses';
export default model(
	name,
	new Schema({
		uses: [
			{
				id: String,
				count: Number,
			},
		],
	}),
	name
);
