"use strict";
import * as Joi from 'joi';
import * as UniversalFunctions from '../../Utils/UniversalFunctions';
import * as Config from "../../Config";
import { AnonymousUserController } from '../../Controllers/User';

export let anonymousRoute = [
    {
        method: 'POST',
        path: '/v1/anonymous/user/register',
        handler: async (request, h) => {
            try {
                let payload: UserRequest.Register = request.payload;
                console.log(`This request is on ${request.path} with parameters ${JSON.stringify(payload)}`)
                let registerResponse = await AnonymousUserController.register(payload);
                return (UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, registerResponse))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'Register to applications',
            tags: ['api', 'anonymous', 'user', 'register'],
            validate: {
                payload: {
                    countryCode: Joi.string().min(1).max(6).trim().required(),
                    phoneNo: Joi.string().min(8).max(10).trim().required(),
                    password: Joi.string().min(6).max(16).trim().required(),
                },
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    // payloadType: 'form',
                    responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/v1/anonymous/user/verify-otp',
        handler: async (request, h) => {
            try {
                let payload: UserRequest.VerifyOtp = request.payload;
                console.log(`This request is on ${request.path} with parameters ${JSON.stringify(payload)}`)
                let verifyOtpResponse = await AnonymousUserController.verifyOtp(payload);
                return UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, verifyOtpResponse.res);
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'Otp verification',
            tags: ['api', 'anonymous', 'user', 'verify-otp'],
            validate: {
                payload: {
                    otp: Joi.number().optional().description('optional').error(new Error('Enter a valid OTP of 4 digits.')),
                    countryCode: Joi.string().min(1).max(6).trim().optional().description('optional'),
                    phoneNo: Joi.string().min(8).max(10).trim().optional().description('optional'),
                    deviceId: Joi.string().required(),
                },
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    // payloadType: 'form',
                    responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/v1/anonymous/user/resend-otp',
        handler: async (request, h) => {
            try {
                let payload: UserRequest.ResendOtp = request.payload;
                let resendOtpResponse = await AnonymousUserController.resendOtp(payload);
                return (UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.OTO_SEND, resendOtpResponse))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'Resend Otp for user verification.',
            tags: ['api', 'anonymous', 'user', 'resend-otp'],
            validate: {
                payload: {
                    countryCode: Joi.string().min(1).max(6).trim().optional().description("optional and status code 210"),
                    phoneNo: Joi.string().min(8).max(10).trim().optional().description("optional and status code 210"),
                },
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    // payloadType: 'form',
                    responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/v1/anonymous/user/login',
        handler: async (request, h) => {
            try {
                let payload: UserRequest.Login = request.payload;
                let loginResponse = await AnonymousUserController.login(payload);
                return UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, loginResponse);
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'Login via phone number and password',
            tags: ['api', 'anonymous', 'user', 'login'],
            validate: {
                payload: {
                    countryCode: Joi.string().min(1).max(6).trim().required(),
                    phoneNo: Joi.string().min(8).max(10).trim().required(),
                    password: Joi.string().min(6).max(16).trim().required(),
                    deviceId: Joi.string().required(),
                },
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    // payloadType: 'form',
                    responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/v1/chat/send-messages',
        handler: async (request, h) => {
            try {
                let payload: UserRequest.ISendMessage = request.payload;
                let resendOtpResponse = await AnonymousUserController.sendMessage(payload);
                return (UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.SEND_MESSAGE, resendOtpResponse))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'Send messages.',
            tags: ['api', 'chat', 'send-messages'],
            auth: 'UserAuth',
            validate: {
                payload: {
                    senderId: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/).required(),
                    message: Joi.string().trim().required(),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    // payloadType: 'form',
                    responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/v1/chat/messagelist',
        handler: async (request, h) => {
            try {
                let payload: UserRequest.UreadMessage = request.query;
                let response = await AnonymousUserController.getMessageList(payload);
                return (UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, response))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'Get all messages ',
            tags: ['api', 'chat', 'messagelist'],
            auth: "UserAuth",
            validate: {
                query: {
                    userId: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/).required(),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/v1/chat/unread-messages',
        handler: async (request, h) => {
            try {
                let payload: UserRequest.UreadMessage = request.query;
                let response = await AnonymousUserController.getUnreadMessage(payload);
                return (UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, response))
            }
            catch (error) {
                return (UniversalFunctions.sendError(error))
            }
        },
        options: {
            description: 'Get all unread messages ',
            tags: ['api', 'chat', 'unread-messages'],
            auth: "UserAuth",
            validate: {
                query: {
                    userId: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/).required(),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },

]
