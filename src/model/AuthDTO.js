// src/model/AuthDTO.js

export class AuthDTO {

    static formatLoginRequest(email, password) {
        return {
            email: email.trim(),
            password: password,
            accessMode: "APP",
            appId: 1
        };
    }

    static formatLoginResponse(apiResponse) {
        return {
            token: apiResponse.access_token,
            userId: apiResponse.user.id,
            userName: apiResponse.user.name,
            userRole: apiResponse.user.role,
            requiresConsent: apiResponse.consentRequired
        };
    }

    static formatForgotPasswordRequest(email) {
        return {
            email: email.trim()
        };
    }

    static formatForgotPasswordResponse(apiResponse) {
        return {
            message: apiResponse.message
        };
    }
}