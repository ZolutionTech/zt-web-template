import { ParsedCodeTable } from '@/services/CodeTableService/types'
import { hookstate, useHookstate } from '@hookstate/core'
import { localstored } from '@hookstate/localstored'

const initialState = { TACO: {} } as ParsedCodeTable

export const codeTableState = hookstate(initialState)

export const useCodeTable = () => useHookstate(codeTableState)
