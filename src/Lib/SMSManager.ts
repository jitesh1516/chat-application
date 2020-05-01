'use strict';

import * as Config from '../Config';
const client = require('twilio')(Config.APP_CONSTANTS.CREDENTIALS.TWILLIO.accountSid, Config.APP_CONSTANTS.CREDENTIALS.TWILLIO.authToken);
/**
 * @description Send otp 
 * @param otp 
 * @param receiverNo 
 */
export let sendotp = function (otp: number, receiverNo: string) {
    client.messages.create({
        body: "Your Uchat code is " + otp + ". " + "Welcome to the community!",
        to: receiverNo, // Text this number
        from: Config.APP_CONSTANTS.CREDENTIALS.TWILLIO.smsFromNumber // From a valid Twilio number
    }).then(message => console.log(message.sid));
}