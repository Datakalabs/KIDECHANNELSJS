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
      createdAt
      updatedAt
      __typename
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
      createdAt
      updatedAt
      __typename
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
      createdAt
      updatedAt
      __typename
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
      createdAt
      updatedAt
      __typename
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
      createdAt
      updatedAt
      __typename
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
      createdAt
      updatedAt
      __typename
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
      createdAt
      updatedAt
      __typename
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
      createdAt
      updatedAt
      __typename
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
export const updateCommunications = /* GraphQL */ `
  mutation UpdateCommunications(
    $input: UpdateCommunicationsInput!
    $condition: ModelCommunicationsConditionInput
  ) {
    updateCommunications(input: $input, condition: $condition) {
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
export const deleteCommunications = /* GraphQL */ `
  mutation DeleteCommunications(
    $input: DeleteCommunicationsInput!
    $condition: ModelCommunicationsConditionInput
  ) {
    deleteCommunications(input: $input, condition: $condition) {
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
