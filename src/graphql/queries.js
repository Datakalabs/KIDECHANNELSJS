/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getDefaultCategories = /* GraphQL */ `
    query GetDefaultCategories($clientId: String!, $id: ID!) {
        getDefaultCategories(clientId: $clientId, id: $id) {
            clientId
            id
            categoryName
            configuration {
                autoResponse
                autoRedirect
                redirectTo
                autoQuote
                quoteOption
                autoTrigger
                triggerOption
                autoRetargeting
                retargetingOption
                retargetingTime
                __typename
            }
            createdAt
            updatedAt
            __typename
        }
    }
`;
export const listDefaultCategories = /* GraphQL */ `
    query ListDefaultCategories(
        $clientId: String
        $id: ModelIDKeyConditionInput
        $filter: ModelDefaultCategoriesFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        listDefaultCategories(
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
                categoryName
                createdAt
                updatedAt
                __typename
            }
            nextToken
            __typename
        }
    }
`;
export const getCategories = /* GraphQL */ `
    query GetCategories($clientId: String!, $id: ID!) {
        getCategories(clientId: $clientId, id: $id) {
            clientId
            id
            categoryName
            configuration {
                autoResponse
                autoRedirect
                redirectTo
                autoQuote
                quoteOption
                autoTrigger
                triggerOption
                autoRetargeting
                retargetingOption
                retargetingTime
                __typename
            }
            createdAt
            updatedAt
            __typename
        }
    }
`;
export const listCategories = /* GraphQL */ `
    query ListCategories(
        $clientId: String
        $id: ModelIDKeyConditionInput
        $filter: ModelCategoriesFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        listCategories(
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
                categoryName
                createdAt
                updatedAt
                __typename
            }
            nextToken
            __typename
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
            createdAt
            updatedAt
            __typename
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
                createdAt
                updatedAt
                __typename
            }
            nextToken
            __typename
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
            createdAt
            updatedAt
            __typename
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
                createdAt
                updatedAt
                __typename
            }
            nextToken
            __typename
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
            createdAt
            updatedAt
            __typename
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
                createdAt
                updatedAt
                __typename
            }
            nextToken
            __typename
        }
    }
`;
export const getCommunications = /* GraphQL */ `
    query GetCommunications($clientId: String!, $dateTime: AWSDateTime!) {
        getCommunications(clientId: $clientId, dateTime: $dateTime) {
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
            createdAt
            updatedAt
            __typename
        }
    }
`;
export const listCommunications = /* GraphQL */ `
    query ListCommunications(
        $clientId: String
        $dateTime: ModelStringKeyConditionInput
        $filter: ModelCommunicationsFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        listCommunications(
            clientId: $clientId
            dateTime: $dateTime
            filter: $filter
            limit: $limit
            nextToken: $nextToken
            sortDirection: $sortDirection
        ) {
            items {
                messageId
                channel
                category
                dateTime
                fromId
                toId
                responseAi
                responseAttachment
            }
            nextToken
            __typename
        }
    }
`;

export const messageDetails = `
  query listCommunications(
    $clientId: String
    $dateTime: ModelStringKeyConditionInput
    $filter: ModelCommunicationsFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCommunications(
      clientId: $clientId
      dateTime: $dateTime
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection) {
    items {
      category
      fromId
      dateTime
      messagSummary
      messageSubject
      messageBody
    }
    nextToken
      __typename
  }
}
`;

export const responseDetails = `
query listCommunications(
    $clientId: String
    $dateTime: ModelStringKeyConditionInput
    $filter: ModelCommunicationsFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCommunications(
      clientId: $clientId
      dateTime: $dateTime
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection) {
    items {
      responseAttachment
      responseAi
      responseSubject
      responseBody
    }
    nextToken
      __typename
  }
}
`;

export const threadQuery = `
query listCommunications(
    $clientId: String
    $dateTime: ModelStringKeyConditionInput
    $filter: ModelCommunicationsFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCommunications(
      clientId: $clientId
      dateTime: $dateTime
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection) {
    items {
      thread
    }
    nextToken
      __typename
  }
}
`;

export const actionsQuery = `
  query listCommunications(
    $clientId: String
    $dateTime: ModelStringKeyConditionInput
    $filter: ModelCommunicationsFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCommunications(
      clientId: $clientId
      dateTime: $dateTime
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection) {
    items {
      fromId
      dateTime
      category
      responseAttachment
      responseAi
      messageSubject
      messageBody
      responseSubject
      responseBody
      execute
    }
    nextToken
      __typename
  }
}
`;
