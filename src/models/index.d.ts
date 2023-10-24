import { ModelInit, MutableModel, __modelMeta__, CompositeIdentifier } from '@aws-amplify/datastore'
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from '@aws-amplify/datastore'

type EagerCodeItem = {
  readonly [__modelMeta__]: {
    identifier: CompositeIdentifier<CodeItem, ['tenantCode', 'tableCode', 'itemCode']>
    readOnlyFields: 'createdAt' | 'updatedAt'
  }
  readonly tenantCode: string
  readonly tableCode: string
  readonly itemCode: string
  readonly isEditable: boolean
  readonly isActive: boolean
  readonly createdAt?: string | null
  readonly updatedAt?: string | null
}

type LazyCodeItem = {
  readonly [__modelMeta__]: {
    identifier: CompositeIdentifier<CodeItem, ['tenantCode', 'tableCode', 'itemCode']>
    readOnlyFields: 'createdAt' | 'updatedAt'
  }
  readonly tenantCode: string
  readonly tableCode: string
  readonly itemCode: string
  readonly isEditable: boolean
  readonly isActive: boolean
  readonly createdAt?: string | null
  readonly updatedAt?: string | null
}

export declare type CodeItem = LazyLoading extends LazyLoadingDisabled
  ? EagerCodeItem
  : LazyCodeItem

export declare const CodeItem: (new (init: ModelInit<CodeItem>) => CodeItem) & {
  copyOf(
    source: CodeItem,
    mutator: (draft: MutableModel<CodeItem>) => MutableModel<CodeItem> | void
  ): CodeItem
}

type EagerLanguageItem = {
  readonly [__modelMeta__]: {
    identifier: CompositeIdentifier<LanguageItem, ['languageCode', 'tableCode', 'itemCode']>
    readOnlyFields: 'createdAt' | 'updatedAt'
  }
  readonly languageCode: string
  readonly tableCode: string
  readonly itemCode: string
  readonly text?: string | null
  readonly createdAt?: string | null
  readonly updatedAt?: string | null
}

type LazyLanguageItem = {
  readonly [__modelMeta__]: {
    identifier: CompositeIdentifier<LanguageItem, ['languageCode', 'tableCode', 'itemCode']>
    readOnlyFields: 'createdAt' | 'updatedAt'
  }
  readonly languageCode: string
  readonly tableCode: string
  readonly itemCode: string
  readonly text?: string | null
  readonly createdAt?: string | null
  readonly updatedAt?: string | null
}

export declare type LanguageItem = LazyLoading extends LazyLoadingDisabled
  ? EagerLanguageItem
  : LazyLanguageItem

export declare const LanguageItem: (new (init: ModelInit<LanguageItem>) => LanguageItem) & {
  copyOf(
    source: LanguageItem,
    mutator: (draft: MutableModel<LanguageItem>) => MutableModel<LanguageItem> | void
  ): LanguageItem
}
