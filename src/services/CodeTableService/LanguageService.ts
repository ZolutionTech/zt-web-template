import { none } from '@hookstate/core'

import { handleError } from '..'
import { AppSyncHelper, logDev, APIResponse } from '@/utils'
import { createLanguageItem, listLanguageItems } from '@/graphql'
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

  async createItem(input: CreateLanguageInput): Promise<APIResponse<LanguageItem>> {
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

  //   async updateLanguageRow(input: UpdateLanguageInput): Promise<Response> {
  //     try {
  //       const params: HandleLanguageMutationVariables = {
  //         input: {
  //           ...input,
  //           action: 'update',
  //         },
  //       }

  //       await AppSyncHelper(Mutations.handleLanguage, params)

  //       // Updates the code table
  //       codeTable[input.tableCode][input.itemCode].merge({
  //         [`${input.languageCode}-text`]: input.text || '',
  //       })

  //       return { status: 200 }
  //     } catch (error) {
  //       logDev('updateLanguageRow ', error)
  //       return codeTableErrorHandler(error)
  //     }
  //   },

  //   async deleteLanguageRow(input: DeleteLanguageInput): Promise<Response> {
  //     try {
  //       const params: HandleLanguageMutationVariables = {
  //         input: {
  //           ...input,
  //           action: 'delete',
  //         },
  //       }

  //       await AppSyncHelper(Mutations.handleLanguage, params)

  //       // Updates the code table
  //       codeTable[input.tableCode][input.itemCode].merge({
  //         [`${input.languageCode}-text`]: none,
  //       })

  //       return { status: 200 }
  //     } catch (error) {
  //       logDev('Delete Language Row ', error)
  //       return codeTableErrorHandler(error)
  //     }
  //   },
}

export const mergeLanguageItemInCodeTable = (languageItem: LanguageItem) => {
  // The text value of languageItem will be merged into the code item key "label" and mapped to the language code {DA: 'Danish', EN: 'English'}
  const { languageCode, text, tableCode, itemCode } = languageItem

  codeTableState[tableCode][itemCode].label.merge({
    [languageCode]: text,
  })
}
