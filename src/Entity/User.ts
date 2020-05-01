'use strict';
import { BaseEntity } from './BaseEntity'
import * as Config from './../Config'
import * as moment from "moment";
import * as UniversalFunctions from './../Utils/UniversalFunctions'
import { TokenManager } from './../Lib';

export class UserClass extends BaseEntity {
    constructor() {
        super('User')
    }

    async createUser(userData: UserRequest.Register) {
        try {
            let dataToInsert = {
                phoneNo: userData.phoneNo,
                countryCode: userData.countryCode,
                fullPhoneNo: userData.countryCode + userData.phoneNo,
                phoneVerify: {
                    otp: await UniversalFunctions.generateOtp(),
                    expirationDate: new Date().getTime() + (10 * 60 * 1000),
                    status: false,
                    date: new Date()
                },
                lastActivityTime: new Date(),
                registrationDate: new Date()
            }
            let user: UserRequest.UserData = await this.createOneEntity(dataToInsert)
            return user
        } catch (error) {
            console.error('User Entity createUser', error)
            return Promise.reject(error)
        }
    }

    async createToken(payload: UserRequest.Device, userData: UserRequest.UserData) {
        try {
            let tokenData = {
                id: userData._id,
                type: 'USER',
                deviceId: payload.deviceId,
                timestamp: new Date().getTime()
            }
            let accessToken: any = await TokenManager.setToken(tokenData);
            return accessToken['accessToken'];
        } catch (error) {
            console.error('User Entity createToken', error)
            return Promise.reject(error)
        }
    }

    async verifyOtpForRegistration(payload: UserRequest.VerifyOtp) {
        try {
            let criteria
            if (payload.otp == Config.APP_CONSTANTS.DATABASE.BY_PASS_OTP) {
                criteria = {
                    phoneNo: payload.phoneNo,
                    countryCode: payload.countryCode,
                    fullPhoneNo: payload.countryCode + payload.phoneNo,
                }
            } else {
                criteria = {
                    phoneNo: payload.phoneNo,
                    countryCode: payload.countryCode,
                    fullPhoneNo: payload.countryCode + payload.phoneNo,
                    "phoneVerify.otp": payload.otp,
                    "phoneVerify.expirationDate": { $gt: new Date().getTime() },
                    "phoneVerify.status": false
                }
            }
            let dataToUpdate = {
                phoneVerify: {
                    otp: 0,
                    expirationDate: 0,
                    status: true,
                    date: new Date()
                },
                userStatus: Config.APP_CONSTANTS.DATABASE.STATUS.ACTIVE,
                lastActivityTime: new Date()
            }
            let user: UserRequest.UserData = await this.DAOManager.findAndUpdate(this.modelName, criteria, dataToUpdate, { new: true, lean: true })
            return user
        } catch (error) {
            console.error('User Entity verifyOtp', error)
            return Promise.reject(error)
        }
    }

    async resendOtpForVerifyUser(payload: UserRequest.ResendOtp) {
        try {
            let criteria = {
                phoneNo: payload.phoneNo,
                countryCode: payload.countryCode,
                fullPhoneNo: payload.countryCode + payload.phoneNo,
            }
            let checkValidUser = await this.getOneEntity(criteria, {})
            if (!checkValidUser || !checkValidUser._id)
                return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.USER_NOT_FOUND)

            if (moment(new Date()).isBefore(moment(new Date(checkValidUser.phoneVerify.expirationDate)))) {
                return checkValidUser;
            }

            let dataToUpdate = {
                phoneVerify: {
                    otp: await UniversalFunctions.generateOtp(),
                    expirationDate: new Date().getTime() + (10 * 60 * 1000),
                    status: false,
                    date: new Date()
                },
                lastActivityTime: new Date()
            }
            let user: UserRequest.UserData = await this.DAOManager.findAndUpdate(this.modelName, criteria, dataToUpdate, { new: true, lean: true })
            return user
        } catch (error) {
            console.error('User Entity resendOtp', error)
            return Promise.reject(error)
        }
    }
}
