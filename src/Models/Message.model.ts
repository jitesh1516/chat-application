import * as mongoose from 'mongoose';
import * as Config from '../Config';


export interface IMessage extends mongoose.Document {
    senderId: string,
    sendTo: string,
    messageType: string,
    message: string,
    isMessageRead: boolean,
    createdAt: number
};

var MessageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sendTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    messageType: {
        type: String, enum: [
            Config.APP_CONSTANTS.DATABASE.MESSAGE_TYPE.TEXT,
        ], index: true, default: Config.APP_CONSTANTS.DATABASE.MESSAGE_TYPE.TEXT
    },
    message: { type: String },
    isMessageRead: { type: Boolean },
    createdAt: { type: Number, required: true },
});

export let Message: mongoose.Model<IMessage> = mongoose.model<IMessage>('Message', MessageSchema);