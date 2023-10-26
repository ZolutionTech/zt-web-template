import { State } from '@hookstate/core'
import { ActionIcon, Menu, useMantineTheme } from '@mantine/core'
import { IconFilter } from '@tabler/icons-react'
import React from 'react'
import { ItemTableHeader } from './types'

type Props = {
  filterState: State<{ key: string; value: string }, {}>
  header: ItemTableHeader
  data: any[] | readonly any[]
}

export const FilterPopover = ({ filterState, header, data }: Props) => {
  const { colors } = useMantineTheme()

  const findUniqueValues = () => {
    const values = data.map((item) => item[header.key])
    return Array.from(new Set(values)) || []
  }

  const onFilter = (value: string) => {
    filterState.set((prevState) => {
      // If key and value is the same, reset the filter
      if (prevState.key === header.key && prevState.value === value) {
        return { key: '', value: '' }
      }
      return { key: header.key, value }
    })
  }

  return (
    <Menu>
      <Menu.Target>
        <ActionIcon
          size='xs'
          variant={filterState.get().key === header.key ? 'filled' : 'light'}
          color='brand'
        >
          <IconFilter />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown miw={200}>
        <Menu.Label>Filter {header.label} by</Menu.Label>

        {findUniqueValues().map((value) => {
          const isActive = filterState.get().value === value
          return (
            <Menu.Item
              key={value}
              my={4}
              onClick={() => onFilter(value)}
              styles={{
                item: {
                  backgroundColor: isActive ? 'primary' : 'transparent',
                },
              }}
              sx={(theme) => ({
                backgroundColor: isActive ? theme.colors.blue[5] : 'transparent',
                color: isActive ? 'white' : 'inherit',
                ':hover': {
                  backgroundColor: isActive
                    ? theme.colors.blue[6]
                    : theme.colorScheme === 'dark'
                    ? theme.colors.dark[4]
                    : theme.colors.gray[0],
                },
              })}
            >
              {header.render ? header.render({ [header.key]: value }) : value}
            </Menu.Item>
          )
        })}
      </Menu.Dropdown>
    </Menu>
  )
}
