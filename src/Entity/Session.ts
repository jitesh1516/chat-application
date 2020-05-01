'use strict';
import { BaseEntity } from './BaseEntity'
import * as Config from '../Config'
import * as UniversalFunctions from '../Utils/UniversalFunctions'


export class SessionClass extends BaseEntity {
    constructor() {
        super('Session')
    }

    async createSession(sessionData: UserRequest.Session, userData: UserRequest.UserData, accessToken: string) {
        try {
            let logoutPreviousSession = await this.logoutPreviousSession(userData._id, sessionData.deviceId)
            let critera = {
                userId: userData._id,
                deviceId: sessionData.deviceId,
            }
            let sessionInfo = {
                userId: userData._id,
                deviceId: sessionData.deviceId,
                loginStatus: true,
                createdAt: new Date(),
            }
            let session = await this.DAOManager.findAndUpdate(this.modelName, critera, sessionInfo, { new: true, upsert: true })
            if (session && session._id)
                return session
            else
                return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_SESSION_REQUEST);
        } catch (error) {
            console.error('User Entity craeteSession', error)
            return Promise.reject(error)
        }
    }

    async logoutPreviousSession(userId: string, deviceId?: string) {
        let logoutCriteria = {
            userId: userId
        }
        if (deviceId) {
            logoutCriteria['deviceId'] = { $ne: deviceId }
        }
        let session = await this.DAOManager.update(this.modelName, { userId: userId }, { loginStatus: false, updatedAt: new Date() }, { new: true, multi: true })
        return
    }
}