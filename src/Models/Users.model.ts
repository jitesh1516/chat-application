import * as mongoose from 'mongoose';
import * as Config from '../Config';

export interface PhoneVerifyObject {
    otp: number,
    expirationDate: number,
    status: boolean,
    date: Date
}

export interface EmailVerifyObject {
    status: boolean,
    date: Date
}
export interface IUser extends mongoose.Document {
    password: string,
    countryCode: string,
    phoneNo: string,
    fullPhoneNo: string,
    phoneVerify: PhoneVerifyObject,
    socketId: string,
    userStatus: string,
    lastActivityTime: Date,
    registrationDate: Date,
};

const UserSchema = new mongoose.Schema({

    ////TODO friends (not pending)
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true, },
    countryCode: { type: String, trim: true, required: true },
    phoneNo: { type: String, index: true, required: true, unique: true },
    fullPhoneNo: { type: String, index: true, required: true, unique: true },
    isLogin: { type: Boolean, default: false, required: true },
    phoneVerify: {
        otp: { type: Number, default: 0 },
        expirationDate: { type: Number, default: 0 },
        status: { type: Boolean, default: false, required: true },
        date: { type: Date }
    },
    socketId: { type: String },
    userStatus: {
        type: String, enum: [
            Config.APP_CONSTANTS.DATABASE.STATUS.ACTIVE,
            Config.APP_CONSTANTS.DATABASE.STATUS.DELETED,
            Config.APP_CONSTANTS.DATABASE.STATUS.BLOCKED,
        ],
        default: Config.APP_CONSTANTS.DATABASE.STATUS.ACTIVE
    },
    lastActivityTime: { type: Date },
    registrationDate: { type: Date, required: true },
});

export let User: mongoose.Model<IUser> = mongoose.model<IUser>('User', UserSchema);
