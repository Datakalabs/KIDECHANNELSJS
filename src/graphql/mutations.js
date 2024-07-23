/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTag = /* GraphQL */ `
    mutation CreateTag(
        $input: CreateTagInput!
        $condition: ModelTagConditionInput
    ) {
        createTag(input: $input, condition: $condition) {
            clientId
            id
            tagName
        }
    }
`;
export const updateTag = /* GraphQL */ `
    mutation UpdateTag(
        $input: UpdateTagInput!
        $condition: ModelTagConditionInput
    ) {
        updateTag(input: $input, condition: $condition) {
            clientId
            id
            tagName
        }
    }
`;
export const deleteTag = /* GraphQL */ `
    mutation DeleteTag(
        $input: DeleteTagInput!
        $condition: ModelTagConditionInput
    ) {
        deleteTag(input: $input, condition: $condition) {
            clientId
            id
            tagName
        }
    }
`;
export const createGroup = /* GraphQL */ `
    mutation CreateGroup(
        $input: CreateGroupInput!
        $condition: ModelGroupConditionInput
    ) {
        createGroup(input: $input, condition: $condition) {
            clientId
            id
            groupName
            categoriesConfig
            color
        }
    }
`;
export const updateGroup = /* GraphQL */ `
    mutation UpdateGroup(
        $input: UpdateGroupInput!
        $condition: ModelGroupConditionInput
    ) {
        updateGroup(input: $input, condition: $condition) {
            clientId
            id
            groupName
            categoriesConfig
            color
        }
    }
`;
export const deleteGroup = /* GraphQL */ `
    mutation DeleteGroup(
        $input: DeleteGroupInput!
        $condition: ModelGroupConditionInput
    ) {
        deleteGroup(input: $input, condition: $condition) {
            clientId
            id
            groupName
            categoriesConfig
            color
        }
    }
`;
export const createPreQuoteOption = /* GraphQL */ `
    mutation CreatePreQuoteOption(
        $input: CreatePreQuoteOptionInput!
        $condition: ModelPreQuoteOptionConditionInput
    ) {
        createPreQuoteOption(input: $input, condition: $condition) {
            clientId
            id
            optionName
            detail
        }
    }
`;
export const updatePreQuoteOption = /* GraphQL */ `
    mutation UpdatePreQuoteOption(
        $input: UpdatePreQuoteOptionInput!
        $condition: ModelPreQuoteOptionConditionInput
    ) {
        updatePreQuoteOption(input: $input, condition: $condition) {
            clientId
            id
            optionName
            detail
        }
    }
`;
export const deletePreQuoteOption = /* GraphQL */ `
    mutation DeletePreQuoteOption(
        $input: DeletePreQuoteOptionInput!
        $condition: ModelPreQuoteOptionConditionInput
    ) {
        deletePreQuoteOption(input: $input, condition: $condition) {
            clientId
            id
            optionName
            detail
        }
    }
`;
export const createTriggerOption = /* GraphQL */ `
    mutation CreateTriggerOption(
        $input: CreateTriggerOptionInput!
        $condition: ModelTriggerOptionConditionInput
    ) {
        createTriggerOption(input: $input, condition: $condition) {
            clientId
            id
            optionName
            detail
        }
    }
`;
export const updateTriggerOption = /* GraphQL */ `
    mutation UpdateTriggerOption(
        $input: UpdateTriggerOptionInput!
        $condition: ModelTriggerOptionConditionInput
    ) {
        updateTriggerOption(input: $input, condition: $condition) {
            clientId
            id
            optionName
            detail
        }
    }
`;
export const deleteTriggerOption = /* GraphQL */ `
    mutation DeleteTriggerOption(
        $input: DeleteTriggerOptionInput!
        $condition: ModelTriggerOptionConditionInput
    ) {
        deleteTriggerOption(input: $input, condition: $condition) {
            clientId
            id
            optionName
            detail
        }
    }
`;
export const createRetargetingOption = /* GraphQL */ `
    mutation CreateRetargetingOption(
        $input: CreateRetargetingOptionInput!
        $condition: ModelRetargetingOptionConditionInput
    ) {
        createRetargetingOption(input: $input, condition: $condition) {
            clientId
            id
            optionName
            detail
        }
    }
`;
export const updateRetargetingOption = /* GraphQL */ `
    mutation UpdateRetargetingOption(
        $input: UpdateRetargetingOptionInput!
        $condition: ModelRetargetingOptionConditionInput
    ) {
        updateRetargetingOption(input: $input, condition: $condition) {
            clientId
            id
            optionName
            detail
        }
    }
`;
export const deleteRetargetingOption = /* GraphQL */ `
    mutation DeleteRetargetingOption(
        $input: DeleteRetargetingOptionInput!
        $condition: ModelRetargetingOptionConditionInput
    ) {
        deleteRetargetingOption(input: $input, condition: $condition) {
            clientId
            id
            optionName
            detail
        }
    }
`;
export const createContact = /* GraphQL */ `
    mutation CreateContact(
        $input: CreateContactInput!
        $condition: ModelContactConditionInput
    ) {
        createContact(input: $input, condition: $condition) {
            clientId
            id
            contactName
            contactEmail
            groupId
        }
    }
`;
export const updateContact = /* GraphQL */ `
    mutation UpdateContact(
        $input: UpdateContactInput!
        $condition: ModelContactConditionInput
    ) {
        updateContact(input: $input, condition: $condition) {
            clientId
            id
            contactName
            contactEmail
            groupId
        }
    }
`;
export const deleteContact = /* GraphQL */ `
    mutation DeleteContact(
        $input: DeleteContactInput!
        $condition: ModelContactConditionInput
    ) {
        deleteContact(input: $input, condition: $condition) {
            clientId
            id
            contactName
            contactEmail
            groupId
        }
    }
`;
export const createCommunication = /* GraphQL */ `
    mutation CreateCommunication(
        $input: CreateCommunicationInput!
        $condition: ModelCommunicationConditionInput
    ) {
        createCommunication(input: $input, condition: $condition) {
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
export const updateCommunication = /* GraphQL */ `
    mutation UpdateCommunication(
        $input: UpdateCommunicationInput!
        $condition: ModelCommunicationConditionInput
    ) {
        updateCommunication(input: $input, condition: $condition) {
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
export const deleteCommunication = /* GraphQL */ `
    mutation DeleteCommunication(
        $input: DeleteCommunicationInput!
        $condition: ModelCommunicationConditionInput
    ) {
        deleteCommunication(input: $input, condition: $condition) {
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
