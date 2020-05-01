'use strict';
import { BaseEntity } from './BaseEntity'
import * as Config from '../Config'
import * as moment from "moment";
import * as UniversalFunctions from '../Utils/UniversalFunctions'


export class PasswordClass extends BaseEntity {
    constructor() {
        super('Password')
    }

    async createPasswordResetToken(payload: UserRequest.PhoneNumberOrEmail, userId: string) {
        try {
            let criteria = { userId: userId }
            let checkValidToken = await this.getOneEntity(criteria, {})
            if (moment(new Date()).isBefore(moment(new Date(checkValidToken.resetToken.expirationDate))) && ((checkValidToken.resetToken.otp != 0 && payload.phoneNo) || (checkValidToken.resetToken.token != "" && payload.email))) {
                return checkValidToken;
            }
            let resetToken: PasswordRequest.ResetToken
            if (payload.countryCode && payload.phoneNo) {
                let otp = await UniversalFunctions.generateOtp();
                resetToken = {
                    status: true,
                    token: "",
                    otp: otp,
                    expirationDate: new Date().getTime() + 10 * 60 * 1000
                }
            }

            if (payload.email) {
                let token: string = await UniversalFunctions.cryptData(payload.email)
                resetToken = {
                    status: true,
                    token: token,
                    otp: 0,
                    expirationDate: new Date().getTime() + 10 * 60 * 60 * 1000
                }
            }

            let criteriaForUpdatePswd = { userId: userId };
            let dataToUpdateForPswd = { resetToken: resetToken }
            console.log("dataToUpdateForPswd", dataToUpdateForPswd)
            let updatePassword = await this.updateOneEntity(criteriaForUpdatePswd, dataToUpdateForPswd)
            return updatePassword

        } catch (error) {
            console.error('Password Entity createPasswordResetToken', error)
            return Promise.reject(error)
        }
    }

    async validateToken(payloadData: UserRequest.VerifyOtp, userId: string) {
        try {
            let criteria = {
                userId: userId,
                "resetToken.status": true
            };
            if (payloadData.otp && payloadData.otp != Config.APP_CONSTANTS.DATABASE.BY_PASS_OTP) {
                criteria['resetToken.otp'] = payloadData.otp
            }
            if (payloadData.emailToken) {
                criteria['resetToken.token'] = payloadData.emailToken
            }
            let pswd: PasswordRequest.UpdatePassword = await this.DAOManager.findOne(this.modelName, criteria, {}, { lean: true })
            if (pswd && pswd._id) {
                if (pswd.userStatus == Config.APP_CONSTANTS.DATABASE.STATUS.BLOCKED)
                    return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.ADMIN_BLOCKED)
                else if (pswd.userStatus == Config.APP_CONSTANTS.DATABASE.STATUS.DELETED)
                    return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.ADMIN_DELETED)
                else {
                    if (moment(new Date()).isAfter(moment(new Date(pswd.resetToken.expirationDate)))) {
                        return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.RESET_PASSWORD_EXPIRED);
                    }
                    return pswd;
                }
            } else {
                if (payloadData.otp)
                    return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_OTP);
                else
                    return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_LINK);
            }

        } catch (error) {
            console.error('Password Entity validateToken', error)
            return Promise.reject(error)
        }
    }
}