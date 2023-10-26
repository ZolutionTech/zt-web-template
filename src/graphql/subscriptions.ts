/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./types";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateCodeItem = /* GraphQL */ `subscription OnCreateCodeItem($filter: ModelSubscriptionCodeItemFilterInput) {
  onCreateCodeItem(filter: $filter) {
    tenantCode
    tableCode
    itemCode
    internalName
    internalDescription
    isEditable
    isActive
    isDisplayed
    isExtended
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateCodeItemSubscriptionVariables,
  APITypes.OnCreateCodeItemSubscription
>;
export const onUpdateCodeItem = /* GraphQL */ `subscription OnUpdateCodeItem($filter: ModelSubscriptionCodeItemFilterInput) {
  onUpdateCodeItem(filter: $filter) {
    tenantCode
    tableCode
    itemCode
    internalName
    internalDescription
    isEditable
    isActive
    isDisplayed
    isExtended
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateCodeItemSubscriptionVariables,
  APITypes.OnUpdateCodeItemSubscription
>;
export const onDeleteCodeItem = /* GraphQL */ `subscription OnDeleteCodeItem($filter: ModelSubscriptionCodeItemFilterInput) {
  onDeleteCodeItem(filter: $filter) {
    tenantCode
    tableCode
    itemCode
    internalName
    internalDescription
    isEditable
    isActive
    isDisplayed
    isExtended
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteCodeItemSubscriptionVariables,
  APITypes.OnDeleteCodeItemSubscription
>;
export const onCreateLanguageItem = /* GraphQL */ `subscription OnCreateLanguageItem(
  $filter: ModelSubscriptionLanguageItemFilterInput
) {
  onCreateLanguageItem(filter: $filter) {
    languageCode
    tableCode
    itemCode
    text
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateLanguageItemSubscriptionVariables,
  APITypes.OnCreateLanguageItemSubscription
>;
export const onUpdateLanguageItem = /* GraphQL */ `subscription OnUpdateLanguageItem(
  $filter: ModelSubscriptionLanguageItemFilterInput
) {
  onUpdateLanguageItem(filter: $filter) {
    languageCode
    tableCode
    itemCode
    text
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateLanguageItemSubscriptionVariables,
  APITypes.OnUpdateLanguageItemSubscription
>;
export const onDeleteLanguageItem = /* GraphQL */ `subscription OnDeleteLanguageItem(
  $filter: ModelSubscriptionLanguageItemFilterInput
) {
  onDeleteLanguageItem(filter: $filter) {
    languageCode
    tableCode
    itemCode
    text
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteLanguageItemSubscriptionVariables,
  APITypes.OnDeleteLanguageItemSubscription
>;
