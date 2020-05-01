import * as Config from '../../Config';
import * as UniversalFunctions from '../../Utils/UniversalFunctions'
import { SMSmanager } from '../../Lib';
import { UserClass } from './../../Entity/User'
import * as mongoose from 'mongoose';
import { SessionClass } from './../../Entity/Session';
import { PasswordClass } from '../../Entity/Password';
import { MessageClass } from '../../Entity/Message';
import * as SocketManager from '../../Lib/SocketManager';



const sessionClass = new SessionClass()
const userClass = new UserClass();
const passwordClass = new PasswordClass();
const messageClass = new MessageClass();



let register = async function (payload: UserRequest.Register) {
    try {
        let criteria = {
            phoneNo: payload.phoneNo,
            countryCode: payload.countryCode,
            fullPhoneNo: payload.countryCode + payload.phoneNo
        }
        let user: UserRequest.UserData = await userClass.getOneEntity(criteria, {})
        if (user && user._id) {
            if (user.phoneVerify.status)
                return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.ALREADY_EXIST)
            else {
                let criteria = {
                    userId: user._id
                }
                let updatePswd = {
                    password: await UniversalFunctions.cryptData(payload.password),
                    phoneVerify: false,
                    updatedAt: new Date()
                }
                let updatePassword = await passwordClass.updateOneEntity(criteria, updatePswd)
                user = await userClass.resendOtpForVerifyUser(payload)
                let userResponse = UniversalFunctions.formatUserData(user)
                return userResponse
            }
        }
        let createUser: UserRequest.UserData = await userClass.createUser(payload)
        let passwordData = {
            userId: createUser._id,
            password: await UniversalFunctions.cryptData(payload.password),
            userStatus: createUser.userStatus,
            phoneVerify: false,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        let createPassword = await passwordClass.createOneEntity(passwordData)
        SMSmanager.sendotp(createUser.phoneVerify.otp, createUser.fullPhoneNo);
        return JSON.parse(JSON.stringify(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED));
    } catch (error) {
        console.log("Anonymous controller register api", error)
        return Promise.reject(error)
    }
}

let verifyOtp = async function (payload: UserRequest.VerifyOtp) {
    try {
        let user: UserRequest.UserData = await userClass.verifyOtpForRegistration(payload)
        if (!user || user == null)
            return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_OTP)
        let accessToken: string = await userClass.createToken(payload, user)
        let session = await sessionClass.createSession(payload, user, accessToken)
        let criteria = {
            userId: user._id
        }
        let updatePswd = {
            phoneVerify: true,
            updatedAt: new Date()
        }
        let updatePassword = await passwordClass.updateOneEntity(criteria, updatePswd)
        return { res: UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.PHONE_VERIFIED, user), accessToken: accessToken }
    } catch (error) {
        console.log("Anonymous controller verifyOtp api", error)
        return Promise.reject(error)
    }
}

let resendOtp = async function (payload: UserRequest.ResendOtp) {
    try {
        let user: UserRequest.UserData = await userClass.resendOtpForVerifyUser(payload);
        SMSmanager.sendotp(user.phoneVerify.otp, user.fullPhoneNo);
        return { phoneVerify: false }
    } catch (error) {
        console.log("Anonymous controller resendOtp api", error)
        return Promise.reject(error)
    }
}

let login = async function (payload: UserRequest.Login) {
    try {

        let criteria = {
            phoneNo: payload.phoneNo,
            countryCode: payload.countryCode,
            fullPhoneNo: payload.countryCode + payload.phoneNo,
            userStatus: Config.APP_CONSTANTS.DATABASE.STATUS.ACTIVE
        }
        let dataToUpdate = {
            isLogin: true
        }
        let user: UserRequest.UserData = await userClass.updateOneEntity(criteria, dataToUpdate)
        if (user && user._id) {
            let password = await passwordClass.getOneEntity({ userId: user._id }, {});
            let isMatchedPassword = await UniversalFunctions.deCryptData(payload.password, password.password);
            if (!isMatchedPassword)
                return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_PASSWORD)
            else {
                if (!user.phoneVerify.status) {
                    let user: UserRequest.UserData = await userClass.resendOtpForVerifyUser(payload)
                    SMSmanager.sendotp(user.phoneVerify.otp, user.fullPhoneNo);
                    return { res: { phoneVerify: false }, accessToken: "" }
                }
                let accessToken = await userClass.createToken(payload, user);
                const socketId = await SocketManager.client();
                await Promise.all([
                    sessionClass.createSession(payload, user, accessToken),
                    userClass.DAOManager.findAndUpdate('User', { _id: mongoose.Types.ObjectId(user._id) }, { socketId: socketId }, { lean: true })
                ]);
                return { res: UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.LOGIN, user), accessToken: accessToken }
            }
        } else {
            return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_LOGIN)
        }
    } catch (error) {
        console.log("Anonymous controller login api", error)
        return Promise.reject(error)
    }
}

const sendMessage = async function (payload: UserRequest.ISendMessage) {
    return messageClass.sendMessage(payload);
}

const getMessageList = async function (payload: UserRequest.UreadMessage) {
    return messageClass.getMessageList(payload);
}

const getUnreadMessage = async function (payload: UserRequest.UreadMessage) {
    return messageClass.getUnreadMessage(payload);
}




export let AnonymousUserController = {
    register: register,
    verifyOtp: verifyOtp,
    resendOtp: resendOtp,
    login: login,
    sendMessage: sendMessage,
    getMessageList: getMessageList,
    getUnreadMessage: getUnreadMessage
}