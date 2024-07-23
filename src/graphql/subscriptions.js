/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTag = /* GraphQL */ `
    subscription OnCreateTag($filter: ModelSubscriptionTagFilterInput) {
        onCreateTag(filter: $filter) {
            clientId
            id
            tagName
            createdAt
            updatedAt
            __typename
        }
    }
`;
export const onUpdateTag = /* GraphQL */ `
    subscription OnUpdateTag($filter: ModelSubscriptionTagFilterInput) {
        onUpdateTag(filter: $filter) {
            clientId
            id
            tagName
            createdAt
            updatedAt
            __typename
        }
    }
`;
export const onDeleteTag = /* GraphQL */ `
    subscription OnDeleteTag($filter: ModelSubscriptionTagFilterInput) {
        onDeleteTag(filter: $filter) {
            clientId
            id
            tagName
            createdAt
            updatedAt
            __typename
        }
    }
`;
export const onCreateGroup = /* GraphQL */ `
    subscription OnCreateGroup($filter: ModelSubscriptionGroupFilterInput) {
        onCreateGroup(filter: $filter) {
            clientId
            id
            groupName
            categoriesConfig
            color
            createdAt
            updatedAt
            __typename
        }
    }
`;
export const onUpdateGroup = /* GraphQL */ `
    subscription OnUpdateGroup($filter: ModelSubscriptionGroupFilterInput) {
        onUpdateGroup(filter: $filter) {
            clientId
            id
            groupName
            categoriesConfig
            color
            createdAt
            updatedAt
            __typename
        }
    }
`;
export const onDeleteGroup = /* GraphQL */ `
    subscription OnDeleteGroup($filter: ModelSubscriptionGroupFilterInput) {
        onDeleteGroup(filter: $filter) {
            clientId
            id
            groupName
            categoriesConfig
            color
            createdAt
            updatedAt
            __typename
        }
    }
`;
export const onCreatePreQuoteOption = /* GraphQL */ `
    subscription OnCreatePreQuoteOption(
        $filter: ModelSubscriptionPreQuoteOptionFilterInput
    ) {
        onCreatePreQuoteOption(filter: $filter) {
            clientId
            id
            optionName
            detail
            createdAt
            updatedAt
            __typename
        }
    }
`;
export const onUpdatePreQuoteOption = /* GraphQL */ `
    subscription OnUpdatePreQuoteOption(
        $filter: ModelSubscriptionPreQuoteOptionFilterInput
    ) {
        onUpdatePreQuoteOption(filter: $filter) {
            clientId
            id
            optionName
            detail
            createdAt
            updatedAt
            __typename
        }
    }
`;
export const onDeletePreQuoteOption = /* GraphQL */ `
    subscription OnDeletePreQuoteOption(
        $filter: ModelSubscriptionPreQuoteOptionFilterInput
    ) {
        onDeletePreQuoteOption(filter: $filter) {
            clientId
            id
            optionName
            detail
            createdAt
            updatedAt
            __typename
        }
    }
`;
export const onCreateTriggerOption = /* GraphQL */ `
    subscription OnCreateTriggerOption(
        $filter: ModelSubscriptionTriggerOptionFilterInput
    ) {
        onCreateTriggerOption(filter: $filter) {
            clientId
            id
            optionName
            detail
            createdAt
            updatedAt
            __typename
        }
    }
`;
export const onUpdateTriggerOption = /* GraphQL */ `
    subscription OnUpdateTriggerOption(
        $filter: ModelSubscriptionTriggerOptionFilterInput
    ) {
        onUpdateTriggerOption(filter: $filter) {
            clientId
            id
            optionName
            detail
            createdAt
            updatedAt
            __typename
        }
    }
`;
export const onDeleteTriggerOption = /* GraphQL */ `
    subscription OnDeleteTriggerOption(
        $filter: ModelSubscriptionTriggerOptionFilterInput
    ) {
        onDeleteTriggerOption(filter: $filter) {
            clientId
            id
            optionName
            detail
            createdAt
            updatedAt
            __typename
        }
    }
`;
export const onCreateRetargetingOption = /* GraphQL */ `
    subscription OnCreateRetargetingOption(
        $filter: ModelSubscriptionRetargetingOptionFilterInput
    ) {
        onCreateRetargetingOption(filter: $filter) {
            clientId
            id
            optionName
            detail
            createdAt
            updatedAt
            __typename
        }
    }
`;
export const onUpdateRetargetingOption = /* GraphQL */ `
    subscription OnUpdateRetargetingOption(
        $filter: ModelSubscriptionRetargetingOptionFilterInput
    ) {
        onUpdateRetargetingOption(filter: $filter) {
            clientId
            id
            optionName
            detail
            createdAt
            updatedAt
            __typename
        }
    }
`;
export const onDeleteRetargetingOption = /* GraphQL */ `
    subscription OnDeleteRetargetingOption(
        $filter: ModelSubscriptionRetargetingOptionFilterInput
    ) {
        onDeleteRetargetingOption(filter: $filter) {
            clientId
            id
            optionName
            detail
            createdAt
            updatedAt
            __typename
        }
    }
`;
export const onCreateContact = /* GraphQL */ `
    subscription OnCreateContact($filter: ModelSubscriptionContactFilterInput) {
        onCreateContact(filter: $filter) {
            clientId
            id
            contactName
            contactEmail
            groupId
            createdAt
            updatedAt
            __typename
        }
    }
`;
export const onUpdateContact = /* GraphQL */ `
    subscription OnUpdateContact($filter: ModelSubscriptionContactFilterInput) {
        onUpdateContact(filter: $filter) {
            clientId
            id
            contactName
            contactEmail
            groupId
            createdAt
            updatedAt
            __typename
        }
    }
`;
export const onDeleteContact = /* GraphQL */ `
    subscription OnDeleteContact($filter: ModelSubscriptionContactFilterInput) {
        onDeleteContact(filter: $filter) {
            clientId
            id
            contactName
            contactEmail
            groupId
            createdAt
            updatedAt
            __typename
        }
    }
`;
export const onCreateCommunication = /* GraphQL */ `
    subscription OnCreateCommunication(
        $filter: ModelSubscriptionCommunicationFilterInput
    ) {
        onCreateCommunication(filter: $filter) {
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
            createdAt
            updatedAt
            __typename
        }
    }
`;
export const onUpdateCommunication = /* GraphQL */ `
    subscription OnUpdateCommunication(
        $filter: ModelSubscriptionCommunicationFilterInput
    ) {
        onUpdateCommunication(filter: $filter) {
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
            createdAt
            updatedAt
            __typename
        }
    }
`;
export const onDeleteCommunication = /* GraphQL */ `
    subscription OnDeleteCommunication(
        $filter: ModelSubscriptionCommunicationFilterInput
    ) {
        onDeleteCommunication(filter: $filter) {
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
            createdAt
            updatedAt
            __typename
        }
    }
`;
