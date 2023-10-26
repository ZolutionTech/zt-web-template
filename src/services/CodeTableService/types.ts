import { CodeItem } from '@/models'

type CodeItemTranslations = {
  [key: string]: string // EN: 'Hello', FR: 'Bonjour'
}

export type ParsedCodeTable = {
  [key: string]: {
    [key: string]: CodeItem & { label?: CodeItemTranslations }
  }
}
