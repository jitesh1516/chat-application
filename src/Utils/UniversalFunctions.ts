'use strict'
import * as Joi from 'joi'
import * as Boom from 'boom'
import * as CONFIG from '../Config'
import * as crypto from 'crypto'
// const crypto = require('crypto'),
//   algorithm = 'aes192',
//   password = CONFIG.APP_CONSTANTS.SERVER.SECRET_KEY;

export let sendError = function (data) {
    console.log('ERROR OCCURED ', data)
    if (typeof data === 'object' && data.hasOwnProperty('statusCode') && (data.hasOwnProperty('message') || data.hasOwnProperty('customMessage'))) {
        console.log('attaching resposnetype', data.type)
        let errorToSend
        if (data.hasOwnProperty('message')) {
            let error = new Error(data.message);
            errorToSend = Boom.boomify(error, { statusCode: data.statusCode })
        } else {
            let error = new Error(data.message);
            errorToSend = Boom.boomify(error, { statusCode: data.statusCode })
        }
        errorToSend.output.payload.responseType = data.type
        return errorToSend
    } else {
        let errorToSend = ''
        if (typeof data === 'object') {
            if (data.name === 'MongoError') {
                errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR.message
            } else if (data.name === 'ApplicationError') {
                errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.APP_ERROR.message + ' : '
            } else if (data.name === 'ValidationError') {
                errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.APP_ERROR.message + data.message
            } else if (data.name === 'CastError') {
                errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR.message + CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ID.message + data.value
            }
        } else {
            errorToSend = data
        }
        var customErrorMessage = errorToSend
        if (typeof customErrorMessage === 'string') {
            if (errorToSend.indexOf("[") > -1) {
                customErrorMessage = errorToSend.substr(errorToSend.indexOf("["))
            }
            customErrorMessage = customErrorMessage && customErrorMessage.replace(/"/g, '')
            customErrorMessage = customErrorMessage && customErrorMessage.replace('[', '')
            customErrorMessage = customErrorMessage && customErrorMessage.replace(']', '')
        }
        return Boom.badRequest(customErrorMessage)
    }
}

export let sendSuccess = function (successMsg, data) {
    if (typeof data === 'object' && data.hasOwnProperty('password')) {
        delete data['password']
    }

    if (typeof data === 'object' && data.hasOwnProperty('statusCode') && data.hasOwnProperty('message')) {
        return { statusCode: data.statusCode, message: data.message, type: data.type, data: data.data || null }

    } else if (successMsg != null && typeof successMsg === 'object' && successMsg.hasOwnProperty('statusCode') && successMsg.hasOwnProperty('message')) {
        successMsg = successMsg || CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT.message
        return { statusCode: successMsg.statusCode, message: successMsg.message, data: data || null }

    } else {
        successMsg = successMsg || CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT.message
        return { statusCode: 200, message: successMsg, data: data || null }
    }
}

export let failActionFunction = async function (request, h, err) {
    console.log("err", err)
    let customErrorMessage = ""
    if (err.name === "ValidationError") {
        customErrorMessage = err.details[0].message
    } else {
        customErrorMessage = err.output.payload.message
    }
    customErrorMessage = customErrorMessage.replace(/"/g, '')
    customErrorMessage = customErrorMessage.replace('[', '')
    customErrorMessage = customErrorMessage.replace(']', '')
    return Boom.badRequest(customErrorMessage)
}

export let authorizationHeaderObj = Joi.object({
    authorization: Joi.string().required().description("bearer space accessToken")
}).unknown()

export let cryptData = async function (stringToCrypt: string) {
    // var cipher = crypto.createCipher(algorithm, password)
    // var crypted = cipher.update("text", 'utf8', 'hex')
    // crypted += cipher.final('hex');
    // console.log(crypted,"crypted") ;

    let hmac = crypto.createHmac('sha256', CONFIG.APP_CONSTANTS.SERVER.ENCRYPTION_KEYS);
    let crypted = hmac.update(stringToCrypt).digest('hex');
    return crypted
}

export let deCryptData = async function (stringToCheck: string, dbString: string) {
    // var decipher = crypto.createDecipher(algorithm,password)
    // var dec = decipher.update(crypted,'hex','utf8')
    // dec += decipher.final('utf8');
    // console.log(dec,"dec") ;

    let hmac = crypto.createHmac('sha256', CONFIG.APP_CONSTANTS.SERVER.ENCRYPTION_KEYS);
    let crypted = hmac.update(stringToCheck).digest('hex');
    return (dbString == crypted) ? true : false
}

export let generateOtp = async function () {
    let otp = (Math.floor(1000 + Math.random() * 9000));
    return otp
}

export let formatUserData = function (userObj: Object) {
    userObj['emailVerify'] = userObj['emailVerify']['status']
    userObj['phoneVerify'] = userObj['phoneVerify']['status']
    delete userObj['isLogin']
    delete userObj['lastActivityTime']
    return userObj
}

export let validateLocation = function (lat, long) {
    var valid = true;
    if (lat < -90 || lat > 90) {
        valid = false;
    }
    if (long < -180 || long > 180) {
        valid = false;
    }
    return valid;
};