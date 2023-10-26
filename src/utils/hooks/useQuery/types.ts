import { AuthModeType } from '@/utils'
import * as GraphQL from '@/graphql'
import * as APITypes from '@/graphql/types'

type QueryName = keyof typeof GraphQL

export type GraphQLSettings<TData> = {
  withoutPagination?: boolean
  isQuiet?: boolean // If true, not console logging data
  next?: (item: TData) => void
  onError?: (errorMessage: string, eventError?: any) => void
  errorLogOptions?: any
  // isAsync?: boolean | TODO: Implement this
}

export type APIQueryInput<TData, TVariables> = {
  query: QueryName
  variables: TVariables
  authMode?: AuthModeType
  settings?: GraphQLSettings<TData>
}

export type APIResponse<TData> = {
  status: number
  data?: TData | null
  error?: string
}
