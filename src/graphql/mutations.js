/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createDefaultCategories = /* GraphQL */ `
  mutation CreateDefaultCategories(
    $input: CreateDefaultCategoriesInput!
    $condition: ModelDefaultCategoriesConditionInput
  ) {
    createDefaultCategories(input: $input, condition: $condition) {
      id
      clientId
      categoryName
      configuration {
        autoResponse
        redirect
        redirectTo
        quote
        quoteOption
        trigger
        triggerOption
        retargeting
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
export const updateDefaultCategories = /* GraphQL */ `
  mutation UpdateDefaultCategories(
    $input: UpdateDefaultCategoriesInput!
    $condition: ModelDefaultCategoriesConditionInput
  ) {
    updateDefaultCategories(input: $input, condition: $condition) {
      id
      clientId
      categoryName
      configuration {
        autoResponse
        redirect
        redirectTo
        quote
        quoteOption
        trigger
        triggerOption
        retargeting
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
export const deleteDefaultCategories = /* GraphQL */ `
  mutation DeleteDefaultCategories(
    $input: DeleteDefaultCategoriesInput!
    $condition: ModelDefaultCategoriesConditionInput
  ) {
    deleteDefaultCategories(input: $input, condition: $condition) {
      id
      clientId
      categoryName
      configuration {
        autoResponse
        redirect
        redirectTo
        quote
        quoteOption
        trigger
        triggerOption
        retargeting
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
export const createCategories = /* GraphQL */ `
  mutation CreateCategories(
    $input: CreateCategoriesInput!
    $condition: ModelCategoriesConditionInput
  ) {
    createCategories(input: $input, condition: $condition) {
      id
      clientId
      categoryName
      configuration {
        autoResponse
        redirect
        redirectTo
        quote
        quoteOption
        trigger
        triggerOption
        retargeting
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
export const updateCategories = /* GraphQL */ `
  mutation UpdateCategories(
    $input: UpdateCategoriesInput!
    $condition: ModelCategoriesConditionInput
  ) {
    updateCategories(input: $input, condition: $condition) {
      id
      clientId
      categoryName
      configuration {
        autoResponse
        redirect
        redirectTo
        quote
        quoteOption
        trigger
        triggerOption
        retargeting
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
export const deleteCategories = /* GraphQL */ `
  mutation DeleteCategories(
    $input: DeleteCategoriesInput!
    $condition: ModelCategoriesConditionInput
  ) {
    deleteCategories(input: $input, condition: $condition) {
      id
      clientId
      categoryName
      configuration {
        autoResponse
        redirect
        redirectTo
        quote
        quoteOption
        trigger
        triggerOption
        retargeting
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
export const createCommunications = /* GraphQL */ `
  mutation CreateCommunications(
    $input: CreateCommunicationsInput!
    $condition: ModelCommunicationsConditionInput
  ) {
    createCommunications(input: $input, condition: $condition) {
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
      clientId
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
export const updateCommunications = /* GraphQL */ `
  mutation UpdateCommunications(
    $input: UpdateCommunicationsInput!
    $condition: ModelCommunicationsConditionInput
  ) {
    updateCommunications(input: $input, condition: $condition) {
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
      clientId
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
export const deleteCommunications = /* GraphQL */ `
  mutation DeleteCommunications(
    $input: DeleteCommunicationsInput!
    $condition: ModelCommunicationsConditionInput
  ) {
    deleteCommunications(input: $input, condition: $condition) {
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
      clientId
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