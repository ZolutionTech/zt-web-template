import { CodeItem } from '@/models'

type CodeItemTranslations = {
  [key: string]: string // EN: 'Hello', FR: 'Bonjour'
}

export type ParsedCodeItem = CodeItem & { label?: CodeItemTranslations }

export type ParsedCodeTable = {
  [key: string]: {
    [key: string]: ParsedCodeItem
  }
}
