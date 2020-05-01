'use strict';
import * as Config from '../Config';
import * as Jwt from 'jsonwebtoken';
import fs = require('fs');
import * as Services from '../DAOManager';
const cert = "cgfhfj"
const DAOManager = new Services.DAOManager();

let getTokenFromDB = async function (userId, deviceId) {
    let userData = {};
    let criteria = {
        _id: userId
    };

    let response = await DAOManager.getData("User", criteria, {}, { lean: true })
    let checkSession = await checkValidSession(userId, deviceId)
    if (checkSession && response && response.length) {
        userData['id'] = response[0]['_id'];
        userData['userData'] = response[0]
        return userData
    } else {
        return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN)
    }
};

let checkValidSession = async function (userId, deviceId) {
    let criteria = {
        userId: userId,
        deviceId: deviceId,
        loginStatus: true
    };
    let check = await DAOManager.getData("Session", criteria, {}, { new: true })
    return (check && check.length > 0) ? true : false
}

export let setToken = async function (tokenData: any) {
    if (!tokenData.id || !tokenData.type || !tokenData.deviceId) {
        return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.TOKENIZATION_ERROR)
    } else {
        try {
            let tokenToSend = await Jwt.sign(tokenData, cert, { algorithm: 'HS256' });
            return { accessToken: tokenToSend }
        } catch (error) {
            console.log("Token Manger, error in setToken", error)
            return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.TOKENIZATION_ERROR)
        }
    }
};

export let verifyToken = async function (token) {
    try {
        let result = await Jwt.verify(token, cert, { algorithms: ['HS256'] });
        console.log("Token Manger, verifyToken", result)
        let resultFinal = await getTokenFromDB(result['id'], result['deviceId'])
        return resultFinal
    } catch (error) {
        return Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN
    }

};

export let decodeToken = async function (token: string) {
    let decodedData = Jwt.verify(token, cert, { algorithms: ['HS256'] })
    if (decodedData) {
        return decodedData
    } else {
        return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN)
    }
};

