declare namespace PasswordRequest {

    export interface ResetToken {
        status: boolean,
        token: string,
        otp: number,
        expirationDate: number
    }

    export interface CreatePassword {
        userId: string,
        password: string,
        resetToken?: ResetToken,
        userStatus?: string,
        emailVerify?: boolean,
        phoneVerify?: boolean
        createdAt?: Date,
        updateAt?: Date
    }

    export interface UpdatePassword {
        _id?: string,
        userId?: string,
        password?: string,
        resetToken?: ResetToken,
        userStatus?: string,
        emailVerify?: boolean,
        phoneVerify?: boolean
        createdAt?: Date,
        updateAt?: Date
    }
}