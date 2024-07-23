/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getKideChannelUserKeys = /* GraphQL */ `
    query GetKideChannelUserKeys {
        getKideChannelUserKeys {
            cognitoUsername
            __typename
        }
    }
`;
export const getTag = /* GraphQL */ `
    query GetTag($clientId: String!, $id: ID!) {
        getTag(clientId: $clientId, id: $id) {
            clientId
            id
            tagName
        }
    }
`;
export const listTags = /* GraphQL */ `
    query ListTags(
        $clientId: String
        $id: ModelIDKeyConditionInput
        $filter: ModelTagFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        listTags(
            clientId: $clientId
            id: $id
            filter: $filter
            limit: $limit
            nextToken: $nextToken
            sortDirection: $sortDirection
        ) {
            items {
                clientId
                id
                tagName
            }
            nextToken
        }
    }
`;
export const getGroup = /* GraphQL */ `
    query GetGroup($clientId: String!, $id: ID!) {
        getGroup(clientId: $clientId, id: $id) {
            clientId
            id
            groupName
            categoriesConfig
            color
        }
    }
`;
export const listGroups = /* GraphQL */ `
    query ListGroups(
        $clientId: String
        $id: ModelIDKeyConditionInput
        $filter: ModelGroupFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        listGroups(
            clientId: $clientId
            id: $id
            filter: $filter
            limit: $limit
            nextToken: $nextToken
            sortDirection: $sortDirection
        ) {
            items {
                clientId
                id
                groupName
                categoriesConfig
                color
            }
            nextToken
        }
    }
`;
export const getPreQuoteOption = /* GraphQL */ `
    query GetPreQuoteOption($clientId: String!, $id: ID!) {
        getPreQuoteOption(clientId: $clientId, id: $id) {
            clientId
            id
            optionName
            detail
        }
    }
`;
export const listPreQuoteOptions = /* GraphQL */ `
    query ListPreQuoteOptions(
        $clientId: String
        $id: ModelIDKeyConditionInput
        $filter: ModelPreQuoteOptionFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        listPreQuoteOptions(
            clientId: $clientId
            id: $id
            filter: $filter
            limit: $limit
            nextToken: $nextToken
            sortDirection: $sortDirection
        ) {
            items {
                clientId
                id
                optionName
                detail
            }
        }
    }
`;
export const getTriggerOption = /* GraphQL */ `
    query GetTriggerOption($clientId: String!, $id: ID!) {
        getTriggerOption(clientId: $clientId, id: $id) {
            clientId
            id
            optionName
            detail
        }
    }
`;
export const listTriggerOptions = /* GraphQL */ `
    query ListTriggerOptions(
        $clientId: String
        $id: ModelIDKeyConditionInput
        $filter: ModelTriggerOptionFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        listTriggerOptions(
            clientId: $clientId
            id: $id
            filter: $filter
            limit: $limit
            nextToken: $nextToken
            sortDirection: $sortDirection
        ) {
            items {
                clientId
                id
                optionName
                detail
            }
        }
    }
`;
export const getRetargetingOption = /* GraphQL */ `
    query GetRetargetingOption($clientId: String!, $id: ID!) {
        getRetargetingOption(clientId: $clientId, id: $id) {
            clientId
            id
            optionName
            detail
        }
    }
`;
export const listRetargetingOptions = /* GraphQL */ `
    query ListRetargetingOptions(
        $clientId: String
        $id: ModelIDKeyConditionInput
        $filter: ModelRetargetingOptionFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        listRetargetingOptions(
            clientId: $clientId
            id: $id
            filter: $filter
            limit: $limit
            nextToken: $nextToken
            sortDirection: $sortDirection
        ) {
            items {
                clientId
                id
                optionName
                detail
            }
        }
    }
`;
export const getContact = /* GraphQL */ `
    query GetContact($clientId: String!, $id: ID!) {
        getContact(clientId: $clientId, id: $id) {
            clientId
            id
            contactName
            contactEmail
            groupId
        }
    }
`;
export const listContacts = /* GraphQL */ `
    query ListContacts(
        $clientId: String
        $id: ModelIDKeyConditionInput
        $filter: ModelContactFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        listContacts(
            clientId: $clientId
            id: $id
            filter: $filter
            limit: $limit
            nextToken: $nextToken
            sortDirection: $sortDirection
        ) {
            items {
                clientId
                id
                contactName
                contactEmail
                groupId
            }
        }
    }
`;
export const getCommunication = /* GraphQL */ `
    query GetCommunication($clientId: String!, $id: ID!) {
        getCommunication(clientId: $clientId, id: $id) {
            clientId
            id
            messageId
            channel
            category
            dateTime
            fromId
            toId
            responseAi
            messageSubject
            messageBody
            messagSummary
            messageAttachment
            responseBody
            responseSubject
            responseAttachment
            execute
            threadId
            thread
            actions
            status
            groupId
            tagId
            contactName
        }
    }
`;
export const listCommunications = /* GraphQL */ `
    query ListCommunications(
        $clientId: String
        $id: ModelIDKeyConditionInput
        $filter: ModelCommunicationFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        listCommunications(
            clientId: $clientId
            id: $id
            filter: $filter
            limit: $limit
            nextToken: $nextToken
            sortDirection: $sortDirection
        ) {
            items {
                clientId
                id
                messageId
                channel
                category
                dateTime
                fromId
                toId
                responseAi
                messageSubject
                messageBody
                messagSummary
                messageAttachment
                responseBody
                responseSubject
                responseAttachment
                execute
                threadId
                thread
                actions
                status
                groupId
                tagId
                contactName
            }
        }
    }
`;
