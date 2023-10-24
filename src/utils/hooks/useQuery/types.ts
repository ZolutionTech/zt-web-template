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
  variables?: TVariables
  authMode?: AuthModeType
  settings?: GraphQLSettings<TData>
}

export type APIQueryResult<TQuery extends QueryName> = {
  data: QueryResult[TQuery]
}

type QueryResult = {
  [key: string]: {
    __typename: string
    items: Array<any>
    nextToken?: string | null
  } | null
}

// export type APIQueryInput = {
//   query: keyof typeof queries
//   variables?: {
//     filter?: any
//     limit?: number | null
//     nextToken?: string | null
//     sortDirection?: queries.APITypes.ModelSortDirection | null
//     [key: string]: any
//   }
//   quiet?: boolean // If true, not logging data
// } & APIDefaultInput

// export type APIMutationInput = {
//   mutation: keyof typeof Mutations
//   variables?: any
//   isAsync?: boolean
// } & APIDefaultInput
