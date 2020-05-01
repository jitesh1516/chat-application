import * as mongoose from 'mongoose';
import * as Config from '../Config';

const SessionSchema = new mongoose.Schema({
    ////TODOos version , device model
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true, },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User", index: true },
    deviceId: { type: String, required: true },
    loginStatus: { type: Boolean, required: true, default: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
});

export interface ISession extends mongoose.Document {
    userId: string,
    deviceId: string,
    loginStatus: boolean,
    createdAt: Date,
    updatedAt: Date
};
export let Session: mongoose.Model<ISession> = mongoose.model<ISession>('Session', SessionSchema);
