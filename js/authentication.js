// import AWS from 'aws-sdk'
import {
    signIn,
    signOut,
    confirmSignIn,
    confirmResetPassword,
    fetchAuthSession,
    resetPassword,
    updatePassword,
    fetchUserAttributes,
    sendUserAttributeVerificationCode,
    confirmUserAttribute,
    getCurrentUser,
} from "@aws-amplify/auth";
import { openVerifyMailModal } from "../src/modals/auth/verifyMail.js";
import { openFirstLoginModal } from "../src/modals/auth/firstLogin.js";
import { openRecoveryPasswordModal } from "../src/modals/auth/recoveryPassword.js";

export async function login({ username, password }) {
    const params = {
        authFlowType: "USER_PASSWORD_AUTH",
        username,
        password,
    };

    try {
        const data = await signIn(params);
        if (
            data.nextStep.signInStep ===
            "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
        ) {
            return confirmSignInWithNewPassword();
        } else if (data.nextStep.signInStep === "DONE") {
            return `Successfully logged in`;
        }
    } catch (error) {
        throw new Error(`Error to login: ${error.message}`);
    }
}
export async function logout() {
    try {
        const data = await signOut();
    } catch (error) {
        throw new Error(`Error to logout:${error.message}`);
    }
}

const confirmSignInWithNewPassword = () => {
    openFirstLoginModal({ confirmSignIn, getCurrentUser });
};

export const refreshAndGetTokens = async () => {
    return await fetchAuthSession({ forceRefresh: true });
};

export const recoveryPassword = async ({ username }) => {
    try {
        const CodeDeliveryDetails = await resetPassword({ username });
        openRecoveryPasswordModal({ confirmResetPassword, username });
        return "Successfully Reset Password";
    } catch (error) {
        console.error("Error during password recovery:", error);
        alert("Error during password recovery. Please try again.");
    }
};

export const verifyEmail = async () => {
    try {
        await sendUserAttributeVerificationCode({ userAttributeKey: "email" });
        openVerifyMailModal({ confirmUserAttribute });
    } catch (error) {
        console.error("Error al enviar el código de verificación:", error);
        alert("Error al enviar el código de verificación. Intenta nuevamente.");
    }
};

export const getUserInfo = async () => {
    const attributes = await fetchUserAttributes(),
        userData = await getCurrentUser();
    return { ...attributes, userData };
};
