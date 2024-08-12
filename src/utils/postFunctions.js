import axios from "axios";
import { URL_KIDECHANNELS } from "../../secrets";

export async function deleteTag({ tokens, labelId }) {
    await axios.post(
        `${URL_KIDECHANNELS}/gmail/label-delete`,
        {
            email: tokens.idToken.payload.email,
            labelId,
        },
        {
            headers: {
                "X-Cognito-Auth": tokens.idToken,
            },
        }
    );
}

export async function modifyTag({ tokens, labelId, newLabelName }) {
    await axios.post(
        `${URL_KIDECHANNELS}/gmail/label-modify`,
        {
            email: tokens.idToken.payload.email,
            labelId,
            newLabelName,
        },
        {
            headers: {
                "X-Cognito-Auth": tokens.idToken,
            },
        }
    );
}

export async function createTag({ tokens, labelName }) {
    await axios.post(
        `${URL_KIDECHANNELS}/gmail/label-create`,
        {
            email: tokens.idToken.payload.email,
            labelName,
        },
        {
            headers: {
                "X-Cognito-Auth": tokens.idToken,
            },
        }
    );
}
