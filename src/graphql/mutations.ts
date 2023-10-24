/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./types";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createCodeItem = /* GraphQL */ `mutation CreateCodeItem(
  $input: CreateCodeItemInput!
  $condition: ModelCodeItemConditionInput
) {
  createCodeItem(input: $input, condition: $condition) {
    tenantCode
    tableCode
    itemCode
    isEditable
    isActive
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateCodeItemMutationVariables,
  APITypes.CreateCodeItemMutation
>;
export const updateCodeItem = /* GraphQL */ `mutation UpdateCodeItem(
  $input: UpdateCodeItemInput!
  $condition: ModelCodeItemConditionInput
) {
  updateCodeItem(input: $input, condition: $condition) {
    tenantCode
    tableCode
    itemCode
    isEditable
    isActive
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateCodeItemMutationVariables,
  APITypes.UpdateCodeItemMutation
>;
export const deleteCodeItem = /* GraphQL */ `mutation DeleteCodeItem(
  $input: DeleteCodeItemInput!
  $condition: ModelCodeItemConditionInput
) {
  deleteCodeItem(input: $input, condition: $condition) {
    tenantCode
    tableCode
    itemCode
    isEditable
    isActive
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteCodeItemMutationVariables,
  APITypes.DeleteCodeItemMutation
>;
export const createLanguageItem = /* GraphQL */ `mutation CreateLanguageItem(
  $input: CreateLanguageItemInput!
  $condition: ModelLanguageItemConditionInput
) {
  createLanguageItem(input: $input, condition: $condition) {
    languageCode
    tableCode
    itemCode
    text
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateLanguageItemMutationVariables,
  APITypes.CreateLanguageItemMutation
>;
export const updateLanguageItem = /* GraphQL */ `mutation UpdateLanguageItem(
  $input: UpdateLanguageItemInput!
  $condition: ModelLanguageItemConditionInput
) {
  updateLanguageItem(input: $input, condition: $condition) {
    languageCode
    tableCode
    itemCode
    text
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateLanguageItemMutationVariables,
  APITypes.UpdateLanguageItemMutation
>;
export const deleteLanguageItem = /* GraphQL */ `mutation DeleteLanguageItem(
  $input: DeleteLanguageItemInput!
  $condition: ModelLanguageItemConditionInput
) {
  deleteLanguageItem(input: $input, condition: $condition) {
    languageCode
    tableCode
    itemCode
    text
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteLanguageItemMutationVariables,
  APITypes.DeleteLanguageItemMutation
>;
