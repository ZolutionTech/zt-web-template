import { none, State } from '@hookstate/core'
import { removeNullValues } from '..'

export const addToList = (
  list: State<any[], {}>,
  newItem: any,
  insert: 'start' | 'end' = 'end'
) => {
  if (!newItem || !list) {
    return
  }
  if (insert === 'start') {
    list.set((prev: any[]) => [newItem, ...prev])
  } else {
    list.merge([newItem])
  }
}

export const updateListItem = (list: State<any[], {}>, newItem: any, compareKey?: string) => {
  const index: number = list
    .get()
    .findIndex((item: any) =>
      compareKey ? item[compareKey] === newItem[compareKey] : item.id === newItem.id
    )

  if (index < 0) return

  list[index].merge(removeNullValues(newItem))
}

export const deleteListItem = (list: State<any[], {}>, newItem: any, compareKey?: string) => {
  if (!newItem || !list) {
    return
  }
  list
    ?.find((item: any) =>
      compareKey ? item.get()?.[compareKey] === newItem[compareKey] : item.get()?.id === newItem.id
    )
    ?.set(none)
}
