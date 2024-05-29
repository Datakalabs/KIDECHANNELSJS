/* eslint-disable */
// this is an auto generated file. This will be overwritten

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

// export const executeQuery = `
//   query listCommunications(
//     $clientId: String
//     $dateTime: ModelStringKeyConditionInput
//     $filter: ModelCommunicationsFilterInput
//     $limit: Int
//     $nextToken: String
//     $sortDirection: ModelSortDirection
//   ) {
//     listCommunications(
//       clientId: $clientId
//       dateTime: $dateTime
//       filter: $filter
//       limit: $limit
//       nextToken: $nextToken
//       sortDirection: $sortDirection) {
//     items {
//       clientId
//       dateTime
//       execute
//     }
//     nextToken
//       __typename
//   }
// }
// `

/* eslint-disable */
// this is an auto generated file. This will be overwritten
export const getPreQuoteOption = /* GraphQL */ `
    query GetPreQuoteOption($clientId: String!, $optionName: String!) {
        getPreQuoteOption(clientId: $clientId, optionName: $optionName) {
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
        $optionName: ModelStringKeyConditionInput
        $filter: ModelPreQuoteOptionFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        listPreQuoteOptions(
            clientId: $clientId
            optionName: $optionName
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
    query GetTriggerOption($clientId: String!, $optionName: String!) {
        getTriggerOption(clientId: $clientId, optionName: $optionName) {
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
        $optionName: ModelStringKeyConditionInput
        $filter: ModelTriggerOptionFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        listTriggerOptions(
            clientId: $clientId
            optionName: $optionName
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
    query GetRetargetingOption($clientId: String!, $optionName: String!) {
        getRetargetingOption(clientId: $clientId, optionName: $optionName) {
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
        $optionName: ModelStringKeyConditionInput
        $filter: ModelRetargetingOptionFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        listRetargetingOptions(
            clientId: $clientId
            optionName: $optionName
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

export const getDefaultCategories = /* GraphQL */ `
    query GetDefaultCategories($clientId: String!, $categoryName: String!) {
        getDefaultCategories(clientId: $clientId, categoryName: $categoryName) {
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
        $categoryName: ModelStringKeyConditionInput
        $filter: ModelDefaultCategoriesFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        listDefaultCategories(
            clientId: $clientId
            categoryName: $categoryName
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
    query GetCategories($clientId: String!, $categoryName: String!) {
        getCategories(clientId: $clientId, categoryName: $categoryName) {
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
        $categoryName: ModelStringKeyConditionInput
        $filter: ModelCategoriesFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        listCategories(
            clientId: $clientId
            categoryName: $categoryName
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
