declare namespace UserRequest {

    export interface Device {
        deviceId: string,
        deviceToken?: string,
        deviceType: string,
    }

    export interface PhoneNumberOrEmail {
        countryCode?: string,
        phoneNo?: string,
        fullPhoneNo?: string,
        email?: string
    }

    export interface Password {
        password?: string
    }
    export interface ISendMessage {
        senderId: string,
        message: string,
        socketId?: string
    }

    export interface UserId {
        userId: string
    }

    export interface Message {
        userId: string,
    }

    export interface UreadMessage {
        userId: string,
    }

    export interface PhoneVerifyObject {
        otp: number,
        expirationDate: number,
        status: boolean,
        date: Date
    }

    export interface EmailVerifyObject {
        status: boolean,
        date: Date
    }

    export interface UserData extends PhoneNumberOrEmail {
        _id: string,
        name?: string,
        email?: string,
        profilePicURL?: string,
        emailVerify?: EmailVerifyObject
        phoneVerify: PhoneVerifyObject,
        userStatus: string,
        profileComplete: boolean,
        isDeactivated: boolean,
        friends: string[],
        blockedUsers: string[],
        lastActivityTime: Date,
        registrationDate: Date,

    }

    export interface Register extends PhoneNumberOrEmail, Password { }

    export interface Session extends Device {
        ipAddress: string
    }

    export interface Login extends Session, PhoneNumberOrEmail, Password { }

    export interface VerifyOtp extends Session, PhoneNumberOrEmail {
        type: string,
        otp: number,
        emailToken: string
    }

    export interface ResendOtp extends PhoneNumberOrEmail, Password {
        type?: string,
    }

    export interface ForgotPassword {
        phase: number,
        type?: string,
        email?: string,
        countryCode?: string,
        phoneNo?: string,
    }

    export interface Upload {
        type: string,
        file: any
    }

    export interface ResetPassword {
        resetPassword: string,
    }

    export interface ProfileUpdate {
        profileComplete?: boolean
        name?: string,
        profilePicURL?: string,
        email?: string
    }
}
