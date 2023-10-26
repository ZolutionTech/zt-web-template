import { State } from '@hookstate/core'
import { StackProps } from '@mantine/core'

export type ItemTableHeader<T> = {
  key: string
  label: string
  searchable?: boolean
  style?: React.CSSProperties
  sortable?: boolean
  filterable?: boolean
  render?: (item: T) => any
}

export type ItemTableProps<T> = {
  headers: ItemTableHeader<T>[]
  data: T[] | readonly T[]
  onRowClick?: (item: T) => void
  onRefresh?: () => Promise<void>
  rowsCount?: number
  isLoading?: boolean
  initialSort?: { key: keyof T; order: 'asc' | 'desc' }
  containerProps?: StackProps
  maxHeight?: number
}

export type TableHeaderProps<T> = {
  headers: ItemTableHeader<T>[]
  sortState: State<
    {
      key: keyof T
      order: 'asc' | 'desc'
    },
    {}
  >
}
