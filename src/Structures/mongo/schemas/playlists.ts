import { model, Schema } from "mongoose";
import { nonReqBoolean, nonReqString, reqNumber, reqString } from "#handler";

const name = "playlists";
export default model(name, new Schema({}), name);
