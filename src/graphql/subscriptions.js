/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateDefaultCategories = /* GraphQL */ `
  subscription OnCreateDefaultCategories(
    $filter: ModelSubscriptionDefaultCategoriesFilterInput
  ) {
    onCreateDefaultCategories(filter: $filter) {
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
export const onUpdateDefaultCategories = /* GraphQL */ `
  subscription OnUpdateDefaultCategories(
    $filter: ModelSubscriptionDefaultCategoriesFilterInput
  ) {
    onUpdateDefaultCategories(filter: $filter) {
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
export const onDeleteDefaultCategories = /* GraphQL */ `
  subscription OnDeleteDefaultCategories(
    $filter: ModelSubscriptionDefaultCategoriesFilterInput
  ) {
    onDeleteDefaultCategories(filter: $filter) {
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
export const onCreateCategories = /* GraphQL */ `
  subscription OnCreateCategories(
    $filter: ModelSubscriptionCategoriesFilterInput
  ) {
    onCreateCategories(filter: $filter) {
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
export const onUpdateCategories = /* GraphQL */ `
  subscription OnUpdateCategories(
    $filter: ModelSubscriptionCategoriesFilterInput
  ) {
    onUpdateCategories(filter: $filter) {
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
export const onDeleteCategories = /* GraphQL */ `
  subscription OnDeleteCategories(
    $filter: ModelSubscriptionCategoriesFilterInput
  ) {
    onDeleteCategories(filter: $filter) {
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
export const onCreateCommunications = /* GraphQL */ `
  subscription OnCreateCommunications(
    $filter: ModelSubscriptionCommunicationsFilterInput
  ) {
    onCreateCommunications(filter: $filter) {
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
export const onUpdateCommunications = /* GraphQL */ `
  subscription OnUpdateCommunications(
    $filter: ModelSubscriptionCommunicationsFilterInput
  ) {
    onUpdateCommunications(filter: $filter) {
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
export const onDeleteCommunications = /* GraphQL */ `
  subscription OnDeleteCommunications(
    $filter: ModelSubscriptionCommunicationsFilterInput
  ) {
    onDeleteCommunications(filter: $filter) {
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
