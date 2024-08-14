import {
    listCommunications,
    listContacts,
    listGroups,
    listPreQuoteOptions,
    listRetargetingOptions,
    listTags,
    listTriggerOptions,
} from "../graphql/queries";
import { client } from "./amplifyConfig";
import { normalizeDate } from "./normalizeDateTime";
import axios from "axios";
import { URL_KIDECHANNELS } from "../../secrets";

export const fetchGroups = async ({ clientId, filters, condition }) => {
    try {
        let graphqlFilter = {};
        if (filters) {
            for (const key of Object.keys(filters)) {
                graphqlFilter[key] = {
                    [condition || "eq"]: filters[key],
                };
            }
        }
        const response = await client.graphql({
            query: listGroups,
            variables: { clientId, filter: graphqlFilter },
        });

        return response.data.listGroups.items;
    } catch (error) {
        console.error("Error fetching groups:", error);
        throw error;
    }
};

export async function fetchCommunications({ clientId, filters, condition }) {
    try {
        let graphqlFilter = {};
        if (filters) {
            for (const key of Object.keys(filters)) {
                graphqlFilter[key] = {
                    [condition || "eq"]: filters[key],
                };
            }
        }
        const response = await client.graphql({
            query: listCommunications,
            variables: { clientId, filter: graphqlFilter },
        });

        return response.data.listCommunications.items.map((comm) => ({
            ...comm,
            dateTime: normalizeDate(comm.dateTime),
        }));
    } catch (error) {
        console.error("Error fetching communications:", error);
        throw error;
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
        throw error;
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
        throw error;
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
        throw error;
    }
}

export async function fetchContacts({ clientId, filters }) {
    try {
        let graphqlFilter = {};
        if (filters) {
            for (const key of Object.keys(filters)) {
                graphqlFilter[key] = { eq: filters[key] };
            }
        }
        const response = await client.graphql({
            query: listContacts,
            variables: { clientId, filter: graphqlFilter },
        });
        return response.data.listContacts.items;
    } catch (error) {
        console.log("Error fetching listContacts ", error);
        throw error;
    }
}

export async function fetchTags({ tokens }) {
    try {
        const {
            data: {
                body: { labels },
            },
        } = await axios.get(
            `${URL_KIDECHANNELS}/gmail/label-list/${tokens.idToken.payload.email}`,
            {
                headers: {
                    Authorization: tokens.idToken,
                },
            }
        );
        console.log(labels);
        const labelsToIgnore = [
            "SENT",
            "CHAT",
            "INBOX",
            "DRAFT",
            "CATEGORY_FORUMS",
            "CATEGORY_UPDATES",
            "CATEGORY_PERSONAL",
            "CATEGORY_PROMOTIONS",
            "CATEGORY_SOCIAL",
            "STARRED",
        ];
        return labels.filter((l) => {
            if (!labelsToIgnore.includes(l.name)) {
                return l;
            }
        });
    } catch (error) {
        console.log("Error fetching listTags ", error);
        throw error;
    }
}

export async function getSync({ tokens }) {
    const {
        data: {
            body: { alreadySync },
        },
    } = await axios.get(
        `${URL_KIDECHANNELS}/google/check-sync/${tokens.idToken.payload.email}`,
        {
            headers: {
                Authorization: tokens.idToken,
            },
        }
    );
    return alreadySync;
}
