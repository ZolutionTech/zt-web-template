import { APITypes } from '@/graphql'
import { hookstate, useHookstate } from '@hookstate/core'

const initialState = {
  // System states
  sessionId: null as string | null,
  subscriptionsCache: {} as { [key: string]: ZenObservable.Subscription },

  // App states
  authenticating: true, // Loading state for auth

  // User states
  isAuthenticated: false,
}

const cachedInitialState = JSON.parse(JSON.stringify(initialState))

export const appState = hookstate(initialState)

export const useAppState = () => useHookstate(appState)

export const resetAppState = () => {
  appState.set(JSON.parse(JSON.stringify(cachedInitialState)))
}
