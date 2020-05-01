'use strict';

import * as AuthBearer from 'hapi-auth-bearer-token';
import { TokenManager } from '../Lib';
import * as  UniversalFunctions from '../Utils/UniversalFunctions';
import * as Config from '../Config';

//Register Authorization Plugin
export let plugin = {
    name: "auth-token-plugin",
    register: async function (server) {

        await server.register(AuthBearer);
        server.auth.strategy('UserAuth', 'bearer-access-token', {
            allowQueryToken: false,
            allowMultipleHeaders: true,
            accessTokenName: 'accessToken',
            validate: async (request, token, h) => {
                let tokenData = await TokenManager.verifyToken(token);
                console.log("USER     ", token)
                if (!tokenData || !tokenData['userData']) {
                    return Promise.reject(UniversalFunctions.sendError(Config.APP_CONSTANTS.STATUS_MSG.ERROR.TOKEN_ALREADY_EXPIRED))
                } else {
                    if (tokenData['userData']['status'] === Config.APP_CONSTANTS.DATABASE.STATUS.BLOCKED) {
                        return Promise.reject(UniversalFunctions.sendError(Config.APP_CONSTANTS.STATUS_MSG.ERROR.ADMIN_BLOCKED));
                    } else if (tokenData['userData']['status'] === Config.APP_CONSTANTS.DATABASE.STATUS.DELETED) {
                        return Promise.reject(UniversalFunctions.sendError(Config.APP_CONSTANTS.STATUS_MSG.ERROR.ADMIN_DELETED));
                    } else {
                        return ({ isValid: true, credentials: { token: token, userData: tokenData['userData'] } })
                    }
                }
            }
        });

        server.auth.strategy('BasicAuth', 'bearer-access-token', {
            tokenType: "Basic",
            validate: async (request, token, h) => {
                let checkApiKeyFunction = await apiKeyFunction(request.headers.api_key)
                if (!checkApiKeyFunction) {
                    return ({ isValid: false, credentials: { token: token, userData: {} } })

                } else {
                    // validate user and pswd here
                    let checkFunction = await basicAuthFunction(token)
                    if (!checkFunction) {
                        return ({ isValid: false, credentials: { token: token, userData: {} } })
                    }
                    return ({ isValid: true, credentials: { token: token, userData: {} } })
                }
            }
        });
    }
};


let apiKeyFunction = async function (api_key) {
    return (api_key === "1234") ? true : false
}

let basicAuthFunction = async function (access_token) {
    // console.log("access_token.........", access_token)
    const credentials = Buffer.from(access_token, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    if (username !== password) {
        return false;
    }
    return true
}