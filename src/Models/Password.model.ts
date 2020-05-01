import * as mongoose from 'mongoose';
import * as Config from '../Config';

const PasswordSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true, },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User", index: true },
    password: { type: String, trim: true, urequired: true },
    userStatus: {
        type: String, enum: [
            Config.APP_CONSTANTS.DATABASE.STATUS.ACTIVE,
            Config.APP_CONSTANTS.DATABASE.STATUS.DELETED,
            Config.APP_CONSTANTS.DATABASE.STATUS.BLOCKED,
        ],
        default: Config.APP_CONSTANTS.DATABASE.STATUS.ACTIVE
    },
    phoneVerify: { type: Boolean, default: false, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
});

export interface IPassword extends mongoose.Document {
    userId: string,
    password: string,
    userStatus: string,
    phoneVerify: boolean
    createdAt: Date,
    updateAt: Date
};
export let Password: mongoose.Model<IPassword> = mongoose.model<IPassword>('Password', PasswordSchema);
