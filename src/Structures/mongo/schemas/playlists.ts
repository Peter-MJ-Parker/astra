import mongoose from 'mongoose';
import { nonReqBoolean, nonReqString, reqNumber, reqString } from '#handler';
const { model, Schema } = mongoose;

const name = 'playlists';
export default model(name, new Schema({}), name);
