/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./types";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getCodeItem = /* GraphQL */ `query GetCodeItem(
  $tenantCode: String!
  $tableCode: String!
  $itemCode: String!
) {
  getCodeItem(
    tenantCode: $tenantCode
    tableCode: $tableCode
    itemCode: $itemCode
  ) {
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
` as GeneratedQuery<
  APITypes.GetCodeItemQueryVariables,
  APITypes.GetCodeItemQuery
>;
export const listCodeItems = /* GraphQL */ `query ListCodeItems(
  $tenantCode: String
  $tableCodeItemCode: ModelCodeItemPrimaryCompositeKeyConditionInput
  $filter: ModelCodeItemFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listCodeItems(
    tenantCode: $tenantCode
    tableCodeItemCode: $tableCodeItemCode
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCodeItemsQueryVariables,
  APITypes.ListCodeItemsQuery
>;
export const getLanguageItem = /* GraphQL */ `query GetLanguageItem(
  $languageCode: String!
  $tableCode: String!
  $itemCode: String!
) {
  getLanguageItem(
    languageCode: $languageCode
    tableCode: $tableCode
    itemCode: $itemCode
  ) {
    languageCode
    tableCode
    itemCode
    text
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetLanguageItemQueryVariables,
  APITypes.GetLanguageItemQuery
>;
export const listLanguageItems = /* GraphQL */ `query ListLanguageItems(
  $languageCode: String
  $tableCodeItemCode: ModelLanguageItemPrimaryCompositeKeyConditionInput
  $filter: ModelLanguageItemFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listLanguageItems(
    languageCode: $languageCode
    tableCodeItemCode: $tableCodeItemCode
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      languageCode
      tableCode
      itemCode
      text
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLanguageItemsQueryVariables,
  APITypes.ListLanguageItemsQuery
>;
