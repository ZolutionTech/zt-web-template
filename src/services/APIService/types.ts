import { AuthModeType, GraphQLSettings } from '@/utils'
import { APITypes, Mutations, Queries } from '@/graphql'

export type APIDefaultInput = {
  authMode?: AuthModeType
  setState?: (item: any) => void
  settings?: GraphQLSettings
  errorLogOptions?: Partial<APITypes.CreateErrorLogInput>
}

export type APIQueryInput = {
  query: keyof typeof Queries
  variables?: {
    filter?: any
    limit?: number | null
    nextToken?: string | null
    sortDirection?: APITypes.ModelSortDirection | null
    [key: string]: any
  }
  quiet?: boolean // If true, not logging data
} & APIDefaultInput

export type APIMutationInput = {
  mutation: keyof typeof Mutations
  variables?: any
  isAsync?: boolean
} & APIDefaultInput
