import { none } from '@hookstate/core'

import { handleError } from '..'
import { AppSyncHelper, logDev, APIResponse } from '@/utils'
import {
  createLanguageItem,
  deleteLanguageItem,
  listLanguageItems,
  updateLanguageItem,
} from '@/graphql'
import { codeTableState } from '@/state'
import { LanguageItem } from '@/models'

export const LanguageService = {
  async getLanguageTableData(): Promise<APIResponse<LanguageItem[]>> {
    const params: ListLanguageItemsQueryVariables = {
      limit: 1000,
    }

    try {
      const { data } = (await AppSyncHelper(listLanguageItems, params)) as {
        data: ListLanguageItemsQuery
        errors: any[]
      }

      const languageList = data.listLanguageItems?.items

      return { data: languageList as LanguageItem[], status: 200 }
    } catch (error) {
      return handleError(error, 'LanguageService.getLanguageTableData')
    }
  },

  async create(input: CreateLanguageInput): Promise<APIResponse<LanguageItem>> {
    try {
      const { data } = (await AppSyncHelper(createLanguageItem, { input })) as {
        data: CreateLanguageItemMutation
        errors: any[]
      }

      mergeLanguageItemInCodeTable(data.createLanguageItem as LanguageItem)

      return { status: 200, data: data.createLanguageItem }
    } catch (error) {
      return handleError(error, 'LanguageService.createItem')
    }
  },

  async update(input: UpdateLanguageInput): Promise<APIResponse<LanguageItem>> {
    try {
      const params: UpdateLanguageItemMutationVariables = {
        input: {
          ...input,
        },
      }

      const { data } = (await AppSyncHelper(updateLanguageItem, params)) as {
        data: UpdateLanguageItemMutation
        errors: any[]
      }

      mergeLanguageItemInCodeTable(data.updateLanguageItem as LanguageItem)

      return { status: 200, data: data.updateLanguageItem }
    } catch (error) {
      return handleError(error, 'LanguageService.updateLanguageRow')
    }
  },

  async delete(input: DeleteLanguageInput): Promise<APIResponse<LanguageItem>> {
    try {
      const params: DeleteLanguageItemMutationVariables = {
        input: {
          ...input,
        },
      }

      const { data } = (await AppSyncHelper(deleteLanguageItem, params)) as {
        data: DeleteLanguageItemMutation
        errors: any[]
      }

      const languageItem = data.deleteLanguageItem

      if (languageItem) {
        removeLanguageItemInCodeTable(languageItem)
      }

      return { status: 200, data: languageItem }
    } catch (error) {
      return handleError(error, 'LanguageService.deleteLanguageRow')
    }
  },
}

export const mergeLanguageItemInCodeTable = (languageItem: LanguageItem) => {
  // The text value of languageItem will be merged into the code item key "label" and mapped to the language code {DA: 'Danish', EN: 'English'}
  const { languageCode, text, tableCode, itemCode } = languageItem

  codeTableState[tableCode][itemCode].label.merge({
    [languageCode]: text,
  })
}

export const removeLanguageItemInCodeTable = (languageItem: LanguageItem) => {
  const { languageCode, tableCode, itemCode } = languageItem

  codeTableState[tableCode][itemCode].label[languageCode].set(none)
}
