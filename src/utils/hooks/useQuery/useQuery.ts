import { useHookstate } from '@hookstate/core'
import * as GraphQL from '@/graphql'

import { AppSyncHelper, logDev, useIsMounted } from '@/utils'
import { APIQueryInput, APIResponse } from './types'
import { handleError } from '@/services'
import { Auth } from 'aws-amplify'

/**
 * A custom hook for making GraphQL queries using AppSyncHelper.
 * @template TData The expected shape of the data returned by the query.
 * @template TVariables The expected shape of the variables used in the query.
 * @param {APIQueryInput<TData, TVariables>} queryInput The input object containing the query, variables, authMode, and settings.
 * @returns {{ loading: boolean, error: string | null, request: () => Promise<APIResponse<TData>> }} An object containing the loading state, error state, and a function to execute the query.
 */
export const useQuery = <TData, TVariables>(queryInput: APIQueryInput<TData, TVariables>) => {
  const loading = useHookstate(false)
  const errorState = useHookstate<string | null>(null)
  const isMounted = useIsMounted()

  const fetch = async (): Promise<APIResponse<TData>> => {
    loading.set(true)
    let { variables, query, authMode, settings } = queryInput

    try {
      // If authMode is not specified, check if user is authenticated and use that as authMode
      authMode ||= (await Auth.currentAuthenticatedUser()) && 'AMAZON_COGNITO_USER_POOLS'
    } catch (error) {
      // If user is not authenticated, use API_KEY as authMode
      authMode ||= 'API_KEY'
    }

    try {
      const { data } = await AppSyncHelper<TData>(GraphQL[query], variables, authMode)
      loading.set(false)

      // Check if either item or items exist (item when getting a single item, items when getting a list)
      let queryData = data[query]?.item || data[query]?.items

      settings?.next?.(queryData)

      !settings?.isQuiet && logDev(`${queryInput.query} data: `, queryData)

      return { status: 200, data: queryData }
    } catch (eventError: any) {
      const { status, data, error } = await handleError(eventError, query)
      logDev(`${queryInput.query} error with status: ${status}. `, error)

      if (isMounted()) {
        loading.set(false)
        errorState.set(error)
      }

      settings?.onError?.(error, eventError)

      return { status, error }
    }
  }

  return { loading: loading.value, error: errorState.value, request: fetch }
}

// const useQuery = (queryInput: APIQueryInput, evaluateEmptyCache: () => boolean = () => true) => {
//   const fetching = useHookstate(false)
//   const error = useHookstate<string | null>(null)
//   const isMounted = useIsMounted()

//   const { quiet = true } = queryInput

//   useEffect(() => {
//     evaluateEmptyCache() && fetch()
//   }, [])

//   const fetch = async () => {
//     fetching.set(true)

//     const { status, data, error } = await APIService.list(queryInput, isMounted)

//     if (status == 200) {
//       !quiet && logDev(`${queryInput.query} data: `, data)
//     } else {
//       !quiet && logDev(`${queryInput.query} error: `, error)
//     }

//     isMounted() && fetching.set(false)
//   }

//   return { loading: fetching.value, error: error.value, request: fetch }
// }
