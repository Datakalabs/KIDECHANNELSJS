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
// import {AWS_ACCESS_KEY,AWS_COGNITO_POOL_CLIENT_ID,AWS_COGNITO_POOL_ID,AWS_REGION,AWS_SECRET_ACCESS_KEY } from '../secrets'
import { Amplify } from "aws-amplify";
import backendConfig from "../src/amplifyconfiguration.json";
import { client } from "./amplifyConfig.js";
import { createDefaultCategories } from "../src/graphql/mutations.js";

Amplify.configure(backendConfig);

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
            return await confirmSignInWithNewPassword();
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

const confirmSignInWithNewPassword = async () => {
    const newPassword = prompt("Please enter a new password:"),
        name = prompt("Indica tu nombre"),
        family_name = prompt("Indica tu apellido"),
        defaultCategories = ["INBOX", "UNCATEGORY"];
    try {
        const data = await confirmSignIn({
                challengeResponse: newPassword,
                options: {
                    userAttributes: {
                        name,
                        family_name,
                    },
                    friendlyDeviceName: "kideChannel",
                },
            }),
            userData = await getCurrentUser();

        for (let index = 0; index < defaultCategories.length; index++) {
            const element = defaultCategories[index];
            try {
                await client.graphql({
                    query: createDefaultCategories,
                    variables: {
                        input: {
                            clientId: userData.userId,
                            categoryName: element,
                            configuration: {
                                autoRedirect: false,
                                autoRetargeting: false,
                                autoTrigger: false,
                                autoQuote: false,
                                autoResponse: false,
                                redirectTo: "{}",
                                quoteOption: "{}",
                                triggerOption: "{}",
                                retargetingOption: "{}",
                                retargetingTime: "",
                            },
                        },
                    },
                });
            } catch (error) {
                console.error(error);
            }
        }
        return "Successfully logged in";
    } catch (error) {
        throw new Error(`Error to set new password:${error.message}`);
    }
};

export const refreshAndGetTokens = async () => {
    return await fetchAuthSession({ forceRefresh: true });
};

export const recoveryPassword = async ({ username }) => {
    try {
        const CodeDeliveryDetails = await resetPassword({ username });
        console.log(CodeDeliveryDetails);
        const confirmationCode = prompt(`Coloca el codigo recibido`);
        const newPassword = prompt(`Coloca tu nueva contraseña`);
        await confirmResetPassword({ username, confirmationCode, newPassword });
        return "Successfully Reset Password";
    } catch (error) {
        console.error("Error during password recovery:", error);
        alert("Error during password recovery. Please try again.");
    }
};

export const verifyEmail = async () => {
    try {
        await sendUserAttributeVerificationCode({ userAttributeKey: "email" });
        const code = prompt(
            "Ingrese el codigo de verificación enviado al correo electrónico."
        );
        if (code) {
            await confirmUserAttribute({
                userAttributeKey: "email",
                confirmationCode: code,
            });
        }
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
