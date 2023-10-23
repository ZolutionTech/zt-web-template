import { appState } from '@/state'
import { API } from 'aws-amplify'
import { DocumentNode } from 'graphql'
import { Observable } from 'zen-observable-ts'

export type APIResponse = {
  status: number
  data?: any
  error?: any
}

export type AuthModeType =
  | 'API_KEY'
  | 'AWS_IAM'
  | 'OPENID_CONNECT'
  | 'AMAZON_COGNITO_USER_POOLS'
  | 'AWS_LAMBDA'
  | undefined

export type GraphQLSettings = {
  withoutPagination?: boolean
}

export type SubscriptionInput = {
  callback: (data: any, subscription: any) => void | Promise<void>
  cacheKey: string
  query: string | DocumentNode
  variables?: object | undefined
  authMode?: AuthModeType
  authToken?: string | undefined
}

const { subscriptionsCache } = appState

export const AppSyncHelper = async (
  query: string | DocumentNode,
  variables?: any | undefined,
  authMode: AuthModeType = 'AMAZON_COGNITO_USER_POOLS',
  authToken: string | undefined = '',
  settings?: GraphQLSettings
) => {
  const result = (await API.graphql({
    query,
    variables,
    authMode,
    authToken,
  })) as {
    data: any
    errors: any[]
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
