import { appState } from '@/state'
import { API } from 'aws-amplify'
import { GraphQLResult } from '@aws-amplify/api-graphql'
import GraphQLAPI, { GRAPHQL_AUTH_MODE } from '@aws-amplify/api-graphql'

import { DocumentNode } from 'graphql'
import { Observable } from 'zen-observable-ts'
import { GraphQLSettings } from '@/utils/hooks/useQuery/types'
import { CodeItem } from '@/models'
import { GetCodeItemQuery } from '@/graphql/types'

export type APIResponse<TData> = {
  status: number
  data?: TData | null
  error?: any
}

export type AuthModeType = keyof typeof GRAPHQL_AUTH_MODE

export type SubscriptionInput = {
  callback: (data: any, subscription: any) => void | Promise<void>
  cacheKey: string
  query: string | DocumentNode
  variables?: object | undefined
  authMode?: AuthModeType
  authToken?: string | undefined
}

const { subscriptionsCache } = appState

export const AppSyncHelper = async <TData>(
  query: string | DocumentNode,
  variables?: any | undefined,
  authMode?: AuthModeType,
  authToken?: string | undefined,
  settings?: GraphQLSettings<TData>
) => {
  const result = (await API.graphql<TData>({
    query,
    variables,
    authMode,
    authToken,
  })) as {
    data: any
    errors?: any[]
  }

  const nextToken = result.data?.[Object.keys(result.data)?.[0]]?.nextToken

  // By default, the API will loop through all the items and return them all, unless you withoutPagination
  if (Boolean(settings?.withoutPagination)) return result

  // Recursively call the API until there are no more items
  if (nextToken) {
    const nextResult = await AppSyncHelper(query, { ...variables, nextToken }, authMode, authToken)

    result.data?.[Object.keys(result.data)?.[0]]?.items?.push(
      ...nextResult.data?.[Object.keys(nextResult.data)?.[0]]?.items
    )
  }

  return result
}

export const SubscriptionHelper = async ({
  callback,
  cacheKey,
  query,
  variables,
  authMode = 'API_KEY',
  authToken = '',
}: SubscriptionInput) => {
  clearOldSubscriptions(cacheKey)

  const subscription = (
    (await API.graphql({
      query,
      variables,
      authMode,
      authToken,
    })) as Observable<any>
  ).subscribe({
    next: ({ provider, value }) => {
      callback(value.data, subscription)
    },
  })

  subscriptionsCache.merge({
    [cacheKey]: subscription,
  })

  return subscription
}

export const clearOldSubscriptions = (subKey: string) => {
  if (subscriptionsCache.get()[subKey]) {
    subscriptionsCache.get()[subKey].unsubscribe()
  }
}
