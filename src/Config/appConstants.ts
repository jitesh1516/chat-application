'use strict';

let SERVER = {
    APP_NAME: 'simple chat',
    PORTS: {
        LOCAL: 3003,
    },
    HOST: {
        LOCAL: '127.0.0.1',
    },
    COUNTRY_CODE: '+91',
    ENCRYPTION_KEYS: 'AC44cb266bd25b3686f12fd76532f3b183'

};
/**
 * dummy credential
 */

let credentials = {
    TWILLIO: {
        accountSid: 'AC44cb266bd25b3686f12fd76532f3b193',
        authToken: 'f105d2cd924357a3ced48050232a862f',
        smsFromNumber: '+1 908-443-7139 '
    },
    MAILCHIMP_KEY: 'd629cd1c725cdcfba0b250f24230debc-us12', ///client
    CRYPTO_ALGO: 'aes-128-ctr',
    CRYPTO_KEY: 'test',
    STRIP_KEY_P: 'pk_test_5Kwf3r7oRzxGpYa2OJE95st3',
    STRIP_KEY_S: 'sk_test_BQNCwvkexDBlu3f9bhRTSlhP',
    CLIENT_USERID: '5b582a647b380f7ba534b140'
}

let SOCKET = {

}

let DATABASE = {
    BY_PASS_OTP: 1212,
    MESSAGE_STATUS: {
        DELETED_RECEIVER: "DELETED_RECEIVER",
        DELETED_SENDER: "DELETED_SENDER",
        SENT: "SENT",
        DELIVERED: "DELIVERED",
        SEEN: "SEEN",
        RECEIVER: "RECEIVER"
    },

    MESSAGE_TYPE: {
        TEXT: "TEXT"
    },
    MESSAGE_CHILD_TYPE: {
        NONE: "NONE",
        REPLY: "REPLY",
        FORWARD: "FORWARD",
    },
    DEVICE_TYPES: {
        IOS: 'IOS',
        ANDROID: 'ANDROID',
        WEB: 'WEB'
    },
    THEME: {
        LIGHT: 'LIGHT',
        DARK: 'DARK',
    },
    GENDER: {
        MALE: 'MALE',
        FEMALE: 'FEMALE',
        OTHER: 'OTHER'
    },
    LANGUAGE: {
        EN: 'EN',
    },
    STATUS: {
        ACTIVE: "ACTIVE",
        BLOCKED: "BLOCKED",
        DELETED: "DELETED"
    },
    CHAT_TYPE: {
        DIRECT: "DIRECT",
        GROUP: "GROUP"
    },
    RESEND_OTP_TYPE: {
        REGISTER: "REGISTER",
        FORGOT: "FORGOT"
    },
    FRIEND_REQUEST_ACTION: {
        ACCEPT: "ACCEPT",
        PENDING: "PENDING",
        CANCEL: "CANCEL",
        REJECT: "REJECT",
        REMOVE: "REMOVE"
    },
    INITIATE_CHAT_TYPE: {
        DIRECT: "DIRECT",
        GROUP: "GROUP",
        CONVERT: "CONVERT"
    },
    DB_CHANGE_TYPE: {
        INSERT: "insert",
        UPDATE: "update",
        REPLACE: "replace",
        DELETE: "delete",
        INVALIDATE: "invalidate",
    }
};

let STATUS_MSG = {
    ERROR: {
        USER_NOT_FOUND: {
            statusCode: 400,
            type: 'USER_NOT_FOUND',
            message: 'Please download and sign up on our mobile App'
        },
        RESET_PASSWORD_EXPIRED: {
            statusCode: 401,
            message: 'Your reset password token is expired!',
            type: 'TOKEN_EXPIRED'
        },
        INVALID_LINK: {
            statusCode: 401,
            message: 'Link is no more valid.',
            type: 'INVALID_LINK'
        },
        INVALID_SESSION_REQUEST: {
            statusCode: 401,
            type: 'INVALID_SESSION_REQUEST',
            message: 'You have requested for an invalid login.'
        },
        INVALID_LOGIN: {
            statusCode: 400,
            type: 'INVALID_LOGIN',
            message: 'Please download and sign up on our mobile App'
        },
        INVALID_REQUEST: {
            statusCode: 400,
            type: 'INVALID_REQUEST',
            message: 'Your request is invalid'
        },
        INVALID_OTP: {
            statusCode: 400,
            type: 'INVALID_OTP',
            message: "Wrong OTP entered"
        },
        INVALID_EMAIL_TOKEN: {
            statusCode: 400,
            type: 'INVALID_EMAIL_TOKEN',
            message: "Wrong email token entered"
        },
        ALREADY_EXIST: {
            statusCode: 400,
            type: 'ALREADY_EXIST',
            message: 'Already Exist '
        },
        DATA_NOT_FOUND: {
            statusCode: 404,
            type: 'DATA_NOT_FOUND',
            message: 'Result not found'
        },
        TOKEN_ALREADY_EXPIRED: {
            statusCode: 401,
            message: 'Your login session expired!',
            type: 'TOKEN_ALREADY_EXPIRED'
        },
        DB_ERROR: {
            statusCode: 400,
            message: 'DB Error : ',
            type: 'DB_ERROR'
        },
        INVALID_ID: {
            statusCode: 400,
            message: 'Invalid Id Provided ',
            type: 'INVALID_ID'
        },
        APP_ERROR: {
            statusCode: 400,
            message: 'Application Error',
            type: 'APP_ERROR'
        },
        APP_VERSION_ERROR: {
            statusCode: 400,
            message: 'One of the latest version or updated version value must be present',
            type: 'APP_VERSION_ERROR'
        },
        INVALID_TOKEN: {
            statusCode: 401,
            message: 'Invalid token provided',
            type: 'INVALID_TOKEN'
        },
        INVALID_CODE: {
            statusCode: 400,
            message: 'Invalid Verification Code',
            type: 'INVALID_CODE'
        },
        DEFAULT: {
            statusCode: 400,
            message: 'Error',
            type: 'DEFAULT'
        },
        ADMIN_DELETED: {
            statusCode: 401,
            message: 'You are blocked by Admin',
            type: 'ADMIN_DELETED'
        },
        ADMIN_BLOCKED: {
            statusCode: 401,
            message: 'You are blocked by Admin',
            type: 'ADMIN_BLOCKED'
        },
        INVALID_PASSWORD: {
            statusCode: 401,
            message: 'Please enter the valid password.',
            type: 'INVALID_USER_PASS'
        },
        UNAUTHORIZED: {
            statusCode: 401,
            message: 'You are not authorized to perform this action',
            type: 'UNAUTHORIZED'
        },
        IMP_ERROR: {
            statusCode: 500,
            message: 'Implementation Error',
            type: 'IMP_ERROR'
        },
        TOKENIZATION_ERROR: {
            statusCode: 501,
            message: 'Failure in creating token.',
            type: 'TOKENIZATION_ERROR'
        }
    },

    SUCCESS: {
        DEFAULT: {
            statusCode: 200,
            message: 'Success',
            type: 'DEFAULT'
        },
        OTO_SEND: {
            statusCode: 200,
            message: 'OTP send on your number.',
            type: 'UPDATED'
        },
        SEND_MESSAGE: {
            statusCode: 200,
            message: 'Message Send Sucessfully.',
            type: 'CREATED'
        },

        CREATED: {
            statusCode: 201,
            message: 'Created Successfully',
            type: 'CREATED'
        },
        UPDATED: {
            statusCode: 200,
            message: 'Updated Successfully',
            type: 'UPDATED'
        },
        LOGIN: {
            statusCode: 200,
            message: 'Logged In Successfully',
            type: 'LOGIN'
        },
        LOGOUT: {
            statusCode: 200,
            message: 'Logged Out Successfully',
            type: 'LOGOUT'
        },
        DELETED: {
            statusCode: 200,
            message: 'Deleted Successfully',
            type: 'DELETED'
        },
        BLOCKED: {
            statusCode: 200,
            message: 'Blocked Successfully',
            type: 'BLOCKED'
        },
        PHONE_VERIFIED: {
            statusCode: 200,
            message: 'Phone number successfully verified.',
            type: 'PHONE_VERIFIED'
        },
        FORGET_PASSWORD: {
            statusCode: 200,
            message: 'Forget password successfully.',
            type: 'FORGET_PASSWORD'
        },
        UPLOAD: {
            statusCode: 200,
            message: 'File uploaded successfully.',
            type: 'UPLOAD'
        },
        FORGET_PASSWORD_EMAIL: {
            statusCode: 209,
            message: 'Reset password link sent to email.',
            type: 'FORGET_PASSWORD_EMAIL'
        },
        FORGET_PASSWORD_PHONE_NUMBER: {
            statusCode: 210,
            message: 'Reset otp sent to registered phone number.',
            type: 'FORGET_PASSWORD_PHONE_NUMBER'
        }
    },

    CONDITIONAL_SUCCESS: {
        ALLREADY_FRIENDS: {
            statusCode: 304,
            message: 'You are allready friend with this user',
            type: 'ALLREADY_FRIENDS'
        },
        REQUEST_EXISTS: {
            statusCode: 304,
            message: 'Friend request already Exists',
            type: 'REQUEST_EXISTS'
        },
        NO_SUCH_REQUEST: {
            statusCode: 304,
            message: 'No such request exists.',
            type: 'NO_SUCH_REQUEST'
        }
    }
};

let swaggerDefaultResponseMessages = [
    { code: 200, message: 'OK' },
    { code: 400, message: 'Bad Request' },
    { code: 401, message: 'Unauthorized' },
    { code: 404, message: 'Data Not Found' },
    { code: 500, message: 'Internal Server Error' }
];

export let APP_CONSTANTS = {
    SERVER: SERVER,
    CREDENTIALS: credentials,
    SOCKET: SOCKET,
    DATABASE: DATABASE,
    STATUS_MSG: STATUS_MSG,
    swaggerDefaultResponseMessages: swaggerDefaultResponseMessages
};

export let constants = APP_CONSTANTS;
export let successStatus = constants.STATUS_MSG.SUCCESS;
export let errorStatus = constants.STATUS_MSG.ERROR;
export let socket = SOCKET;
