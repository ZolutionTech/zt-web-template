import { createCodeItem, listCodeItems, updateCodeItem } from '@/graphql'
import { AppSyncHelper, APIResponse } from '@/utils'
import { ParsedCodeTable } from './types'
import { CodeItem, LanguageItem } from '@/models'
import { LanguageService, handleError, mergeLanguageItemInCodeTable } from '..'

import { codeTableState } from '@/state/codeTable'
import { ImmutableObject, none } from '@hookstate/core'

export const CodeTableService = {
  async initialize() {
    try {
      const { data } = (await AppSyncHelper(
        listCodeItems,
        { limit: 1000 }
        // 'AMAZON_COGNITO_USER_POOLS'
      )) as {
        data: ListCodeItemsQuery
      }

      const codeTableItems = data.listCodeItems?.items || []

      // The Code Items are mapped into a hash map of Code Tables
      const parsedCodeTable = parseCodeTableToHashMap(codeTableItems)

      // Merges language items into the code table
      const parsedCodeTableWithLanguages = await mergeLanguageItemsInCodeTable(parsedCodeTable)

      codeTableState.set(parsedCodeTableWithLanguages)
    } catch (error) {
      return handleError(error, 'CodeTableService.initialize')
    }
  },

  getItem(tableCode: string, itemCode: string) {
    return codeTableState.get()[tableCode]?.[itemCode] || '-'
  },

  getTable(tableCode: string): ImmutableObject<CodeItem>[] {
    return Object.values(codeTableState.get()[tableCode] || {})
  },

  async createItem(
    input: Omit<CreateCodeItemInput, 'isActive' | 'isEditable'>
  ): Promise<APIResponse<CodeItem>> {
    try {
      const params: CreateCodeItemMutationVariables = {
        input: {
          isActive: true,
          isEditable: false,
          isExtended: false,
          isDisplayed: false,
          ...input,
        },
      }

      const { data } = (await AppSyncHelper(createCodeItem, params)) as {
        data: CreateCodeItemMutation
        errors: any[]
      }

      const codeItem = data.createCodeItem

      if (codeItem) {
        mergeItemInCodeTable(codeItem)
      }

      return { status: 200, data: codeItem }
    } catch (error) {
      return handleError(error, 'CodeTableService.createItem')
    }
  },

  //   async updateItem(input: UpdateCodeItemInput): Promise<APIResponse> {
  //     console.log(input)
  //     try {
  //       const params: UpdateCodeItemMutationVariables = {
  //         input: {
  //           ...input,
  //         },
  //       }

  //       const { data } = (await AppSyncHelper(updateCodeItem, params)) as {
  //         data: UpdateCodeItemMutation
  //         errors: any[]
  //       }

  //       const codeItem = data.updateCodeItem

  //       if (codeItem) {
  //         mergeItemInCodeTable(codeItem)
  //       }

  //       return { status: 200, data: codeItem }
  //     } catch (error) {
  //       return handleError(error, 'CodeTableService.updateItem')
  //     }
  //   },

  //   generateItemCode(name: string) {
  //     return name
  //       .replace(/[^a-zA-Z0-9]/g, '')
  //       .toUpperCase()
  //       .substring(0, 10)
  //   },
}

const parseCodeTableToHashMap = (codeTableItems: (CodeItem | null)[]): ParsedCodeTable => {
  // The Code Items are mapped into a hash map of Code Tables with the Table Code as the initial key and the Item Code as the secondary key
  // {<tableCode>: {<itemCode>: <codeItem>}

  return codeTableItems.reduce((acc: ParsedCodeTable, cur) => {
    if (cur == null) {
      return acc
    }

    // TACO specifies the overall code tables
    if (cur.tableCode === 'TACO' && !acc[cur.itemCode]) {
      //
      acc[cur.itemCode] = {}
    } else if (acc[cur.tableCode]) {
      acc[cur.tableCode][cur.itemCode] = {
        ...cur,
        label: { EN: cur.internalName },
      }
    } else {
      acc[cur.tableCode] = {
        [cur.itemCode]: {
          ...cur,
          label: { EN: cur.internalName },
        },
      }
    }
    return acc
  }, {})
}

export const mergeItemInCodeTable = (codeItem: CodeItem) => {
  if (codeTableState[codeItem.tableCode]?.[codeItem.itemCode]) {
    codeTableState[codeItem.tableCode][codeItem.itemCode].merge(codeItem)
  } else {
    codeTableState[codeItem.tableCode].set({ [codeItem.itemCode]: codeItem })
  }
}

export const removeItemInCodeTable = (codeItem: CodeItem) => {
  if (codeTableState[codeItem.tableCode]?.[codeItem.itemCode]) {
    codeTableState[codeItem.tableCode][codeItem.itemCode].set(none)
  }
}

export const mergeLanguageItemsInCodeTable = async (codeTable: ParsedCodeTable) => {
  //
  const { data: languageList } = await LanguageService.getLanguageTableData()

  if (!languageList) return codeTable

  const codeTableWithLanguage = { ...codeTable }

  languageList.forEach((languageItem: LanguageItem) => {
    const { languageCode, tableCode, itemCode, text } = languageItem
    console.log(languageItem)
    // Shoves the language item into the code table items
    codeTableWithLanguage[tableCode][itemCode]!.label = {
      ...codeTableWithLanguage?.[tableCode]?.[itemCode]?.label,
      [languageCode]: text,
    }
  })

  return codeTableWithLanguage
}
