import {
    listCommunications,
    listContacts,
    listGroups,
    listPreQuoteOptions,
    listRetargetingOptions,
    listTriggerOptions,
} from "../graphql/queries";
import { client } from "./amplifyConfig";
import { normalizeDate } from "./normalizeDateTime";

export const fetchGroups = async ({ clientId }) => {
    try {
        const response = await client.graphql({
            query: listGroups,
            variables: { clientId },
        });

        return response.data.listGroups.items;
    } catch (error) {
        console.error("Error fetching groups:", error);
    }
};

export async function fetchCommunications({ clientId }) {
    try {
        const response = await client.graphql({
            query: listCommunications,
            variables: { clientId },
        });

        return response.data.listCommunications.items.map((comm) => ({
            ...comm,
            dateTime: normalizeDate(comm.dateTime),
        }));
    } catch (error) {
        console.error("Error fetching communications:", error);
    }
}

export async function fetchPreQuoteOptions({ clientId }) {
    try {
        const response = await client.graphql({
            query: listPreQuoteOptions,
            variables: { clientId },
        });
        return response.data.listPreQuoteOptions.items;
    } catch (error) {
        console.log("Error fetching listPreQuoteOptions", error);
    }
}
export async function fetchTriggerOptions({ clientId }) {
    try {
        const response = await client.graphql({
            query: listTriggerOptions,
            variables: { clientId },
        });
        return response.data.listTriggerOptions.items;
    } catch (error) {
        console.log("Error fetching listTriggerOptions", error);
    }
}
export async function fetchRetargetingOptions({ clientId }) {
    try {
        const response = await client.graphql({
            query: listRetargetingOptions,
            variables: { clientId },
        });
        return response.data.listRetargetingOptions.items;
    } catch (error) {
        console.log("Error fetching listRetargetingOptions", error);
    }
}

export async function fetchContact({ clientId }) {
    try {
        const response = await client.graphql({
            query: listContacts,
            variables: { clientId },
        });
        return response.data.listContacts.items;
    } catch (error) {
        console.log("Error fetching listContacts ", error);
    }
}
