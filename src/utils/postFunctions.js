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
                Authorization: tokens.idToken,
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
                Authorization: tokens.idToken,
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
                Authorization: tokens.idToken,
            },
        }
    );
}

export async function executeResponse({
    tokens,
    communicationToResponse: {
        id,
        messageId,
        messageHeaderId,
        messageSubject,
        channel,
        fromId,
        toId,
        threadId,
        responseAi,
        responseBody,
        responseAttachment,
        actions,
        groupId,
    },
    clientId,
}) {
    const { data } = await axios.post(
        `${URL_KIDECHANNELS}/communication/send`,
        {
            clientId,
            id,
            messageId,
            messageHeaderId,
            messageSubject,
            threadId,
            channel,
            fromId,
            toId,
            responseAi,
            responseBody,
            responseAttachment,
            actions,
            groupId,
        },
        {
            headers: {
                Authorization: tokens.idToken,
            },
        }
    );
    return data;
}
