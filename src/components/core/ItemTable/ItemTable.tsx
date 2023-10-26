import React, { useCallback } from 'react'
import { useHookstate } from '@hookstate/core'
import {
  ActionIcon,
  Group,
  LoadingOverlay,
  Pagination,
  ScrollArea,
  Stack,
  Table,
  TextInput,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { IconArrowUp, IconArrowsSort, IconRefresh, IconSearch } from '@tabler/icons-react'
import { FilterPopover } from './FilterPopover'
import { ItemTableHeader, ItemTableProps, TableHeaderProps } from './types'

const TableHeader = <T extends { [key: string]: any }>({
  headers,
  sortState,
}: TableHeaderProps<T>) => {
  const { colors } = useMantineTheme()

  const onSort = (key: string) => {
    if (sortState.get().key === key) {
      switch (sortState.get().order) {
        case 'desc':
          sortState.set({ key, order: 'asc' })
          break
        case 'asc':
          sortState.set({ key: '', order: 'desc' })
          break

        default:
          break
      }
    } else {
      sortState.set({ key, order: 'desc' })
    }
  }

  const renderSortIcon = (key: string) => {
    if (sortState.get().key === key) {
      if (sortState.get().order === 'asc') {
        return <IconArrowUp size={14} />
      } else {
        return <IconArrowUp size={14} style={{ transform: 'rotate(180deg)' }} />
      }
    } else {
      return <IconArrowsSort size={14} />
    }
  }

  return (
    <Table.Thead>
      <Table.Tr>
        {headers.map((header) => {
          const isSortable = header.sortable
          const isFilterable = header.filterable

          const isActivelySorting = sortState.get().key === header.key

          return (
            <Table.Th
              key={header.key}
              style={{ cursor: header.sortable ? 'pointer' : 'default' }}
              onClick={() => header.sortable && onSort(header.key)}
            >
              <Group style={{ flexWrap: 'nowrap' }} gap='xs'>
                <Group
                  wrap='nowrap'
                  onClick={() => (isSortable ? onSort(header.key) : null)}
                  styles={{
                    root: {
                      cursor: isSortable ? 'pointer' : 'default',
                      borderBottomWidth: 2,
                      borderColor: isActivelySorting ? colors.primary[7] : 'transparent',

                      //   '&:hover': {
                      //     borderColor: isSortable ? colors.primary[7] : 'transparent',
                      //   },
                    },
                  }}
                >
                  {header.label}
                  {isSortable && renderSortIcon(header.key)}
                </Group>

                {/* {isFilterable && (
                  <FilterPopover filterState={filterState} header={header} data={data} />
                )} */}
              </Group>
            </Table.Th>
          )
        })}
        {/* <th style={{ width: 40 }} /> */}
      </Table.Tr>
    </Table.Thead>
  )
}

export const ItemTable = <T extends { [key: string]: any }>({
  data = [],
  headers = [],
  onRowClick,
  onRefresh,
  isLoading = false,
  rowsCount = 15,
  initialSort = { key: '', order: 'asc' },
  containerProps,
  maxHeight,
}: ItemTableProps<T>) => {
  const refreshing = useHookstate(false)
  const searchInput = useHookstate('')
  const activePage = useHookstate(1)
  const sortState = useHookstate(initialSort)
  const filterState = useHookstate({ key: '', value: '' })

  // useEffect(() => {
  //   activePage.set(1)
  // }, [data])

  const handleRefresh = async () => {
    refreshing.set(true)
    await onRefresh?.()
    refreshing.set(false)
  }

  const filteredData = useCallback(() => {
    // Filter by filterState
    let filteredData = [...data]

    if (filterState.get().key && filterState.get().value) {
      filteredData = filteredData.filter(
        (item) => item[filterState.get().key] === filterState.get().value
      )
    }

    // Filter by searchInput
    return filteredData.filter((item) => {
      const searchableHeaders = headers.filter((header) => header.searchable)

      for (const header of searchableHeaders) {
        if (item[header.key]?.toLowerCase().includes(searchInput.get().toLowerCase())) {
          return true
        }
      }

      return false
    })
  }, [data, headers, searchInput.get()])

  const sortedData = useCallback(() => {
    return filteredData().sort((a, b) => {
      const sortKey = sortState.get().key as keyof T

      if (sortState.get().order === 'asc') {
        return a[sortKey] > b[sortKey] ? 1 : -1
      } else {
        return a[sortKey] < b[sortKey] ? 1 : -1
      }
    })
  }, [data, headers, sortState.get()])

  const paginatedData = () => {
    return sortedData().slice((activePage.get() - 1) * rowsCount, activePage.get() * rowsCount)
  }

  return (
    <Stack pos='relative' {...containerProps}>
      <Group justify='space-between' align='flex-end'>
        <LoadingOverlay visible={refreshing.get() || isLoading} />
        <Group align='flex-end'>
          <TextInput
            maw={300}
            label='Search'
            value={searchInput.get()}
            onChange={(event) => searchInput.set(event.target.value)}
            leftSection={<IconSearch size={20} />}
          />

          {onRefresh && (
            <ActionIcon
              color='primary'
              variant='light'
              onClick={handleRefresh}
              radius='xl'
              size='lg'
            >
              <IconRefresh size={20} />
            </ActionIcon>
          )}
        </Group>

        <Group>
          <Stack gap={6} align='flex-end'>
            <Title order={6} fw={500}>
              ({sortedData().length}) elementer
            </Title>

            <Pagination
              size='md'
              onChange={activePage.set}
              total={Math.ceil(filteredData().length / rowsCount)}
            />
          </Stack>
        </Group>
      </Group>

      <ScrollArea h={maxHeight}>
        <Table verticalSpacing='sm' striped highlightOnHover withTableBorder>
          <TableHeader headers={headers} sortState={sortState} />

          <Table.Tbody>
            {paginatedData().map((item, index) => (
              <Table.Tr
                key={index}
                onClick={() => (onRowClick ? onRowClick(item) : null)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {headers.map((header) => (
                  <Table.Td
                    key={header.key}
                    style={{
                      minWidth: 75,
                      ...header.style,
                    }}
                  >
                    {header.render ? header.render(item) : item[header.key]}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      <Group my='lg' justify='flex-end'>
        <Pagination
          onChange={activePage.set}
          total={Math.ceil(filteredData().length / rowsCount)}
        />
      </Group>
    </Stack>
  )
}
