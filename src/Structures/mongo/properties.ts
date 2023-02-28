import { useContainer } from "#Astra";
import { env } from "#utils";
import mongoose from "mongoose";
const { connect, set } = mongoose;

export async function mongoConnect(url?: string) {
	useContainer("mongoose");
	const dbOptions = {
		keepAlive: true,
		keepAliveInitialDelay: 300000,
		autoIndex: true,
		connectTimeoutMS: 10000,
		family: 4,
	};

	set("strictQuery", true);
	await connect(url ? url : env.CONNECT!, dbOptions);
}

export const reqString = {
	type: String,
	required: true,
};

export const nonReqString = {
	type: String,
	default: "",
	required: false,
};

export const reqBoolean = {
	type: Boolean,
	required: true,
};

export const nonReqBoolean = {
	type: Boolean,
	default: false,
	required: false,
};

export const reqNumber = {
	type: Number,
	required: true,
};

export const nonReqNumber = {
	type: Number,
	default: 0,
	required: false,
};
