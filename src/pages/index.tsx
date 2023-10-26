import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Select,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'

import { useHookstate } from '@hookstate/core'
import { CodeTableService } from '@/services'
import { useCodeTable } from '@/state'
import { useEffect } from 'react'
import { ItemTable } from '@/components'
import CodeTableModal from '@/layout/CodeTableModal/CodeTableModal'
import { CodeItem } from '@/models'
import { ItemTableHeader } from '@/components/core/ItemTable/types'
import { parseState } from '@/utils'
import { IconTrash } from '@tabler/icons-react'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'

const headers: ItemTableHeader<CodeItem>[] = [
  {
    key: 'internalName',
    label: 'Internal Name',
    searchable: true,
    sortable: true,
  },

  {
    key: 'itemCode',
    label: 'Item Code',
    searchable: true,
    sortable: true,
  },
  {
    key: 'isEditable',
    label: 'Fixed Value',
    sortable: true,
    render(item) {
      return <Badge variant='light'>{item.isEditable ? 'No' : 'Yes'}</Badge>
    },
  },
  {
    key: 'actions',
    label: 'Actions',
    style: { width: 80 },
    render(item) {
      return <DeleteButton item={item} />
    },
  },
]

export default function Home() {
  const codeTable = useCodeTable()
  const selectedTable = useHookstate<string | null>(null)
  const loading = useHookstate(false)

  const modalState = useHookstate({
    isOpen: false,
    selectedCodeItem: null as CodeItem | null,
    isEdit: false,
    selectedTableCode: null as string | null,
  })

  useEffect(() => {
    Object.values(codeTable.get()['TACO']).length === 0 && init()
  }, [])

  const init = async () => {
    loading.set(true)
    await CodeTableService.initialize()

    loading.set(false)
  }

  return (
    <Stack>
      <CodeTableModal modalState={modalState} />

      <Title order={4}>Create, Update, Delete af Code Items</Title>
      <Title order={4}>Forbind Language</Title>
      <Title order={4}>Language oversigter, forskellige filtrering osv. IKKE POC</Title>

      <Group align='flex-end' wrap='nowrap'>
        <Select
          clearable
          placeholder='Click to select a table'
          label='Select a table'
          value={selectedTable.get()}
          onChange={(value) => selectedTable.set(value)}
          data={CodeTableService.getTable('TACO').map((table) => ({
            value: table.itemCode,
            label: table.internalName,
          }))}
          size='md'
          w='100%'
        />

        <Button
          size='md'
          disabled={!selectedTable.value}
          onClick={() => {
            modalState.set({
              isOpen: true,
              selectedCodeItem: null,
              isEdit: false,
              selectedTableCode: selectedTable.value,
            })
          }}
        >
          Create new{' '}
          {selectedTable.value &&
            CodeTableService.getItem('TACO', selectedTable.value).internalName}{' '}
          code item
        </Button>
      </Group>

      <Card withBorder>
        <Title order={2} mb='md'>
          {selectedTable.value
            ? `Code Items for  ${
                CodeTableService.getItem('TACO', selectedTable.value).internalName
              }`
            : `Select a table to view code items`}
        </Title>

        <ItemTable<CodeItem>
          headers={headers}
          data={
            selectedTable.value
              ? Object.values(parseState(codeTable.value)[selectedTable.value] || {})
              : []
          }
          onRefresh={init}
          isLoading={loading.get()}
          initialSort={{ key: 'internalName', order: 'asc' }}
          onRowClick={(item) =>
            modalState.set({
              isOpen: true,
              selectedCodeItem: item,
              isEdit: true,
              selectedTableCode: selectedTable.value,
            })
          }
        />
      </Card>
    </Stack>
  )
}

const DeleteButton = ({ item }: { item: CodeItem }) => {
  const loading = useHookstate(false)
  const confirmInput = useHookstate('')

  const onDelete = async () => {
    loading.set(true)

    const { status, error, data } = await CodeTableService.deleteItem({
      tenantCode: '_',
      tableCode: item.tableCode,
      itemCode: item.itemCode,
    })

    loading.set(false)

    if (status === 200 && data) {
      modals.closeAll()
      notifications.show({
        title: 'Success',
        message: `Code Item ${data.itemCode} deleted`,
        color: 'teal',
      })
    } else {
      notifications.show({
        title: 'Error',
        message: error ?? 'Something went wrong',
        color: 'red',
      })
    }
  }

  const openConfirmModal = () => {
    modals.open({
      title: 'Subscribe to newsletter',
      children: (
        <>
          <TextInput
            label='Write "confirm"'
            value={confirmInput.get()}
            onChange={(event) => confirmInput.set(event.currentTarget.value)}
            data-autofocus
          />
          <Group wrap='nowrap'>
            <Button loading={loading.get()} fullWidth onClick={() => modals.closeAll()} mt='md'>
              Cancel
            </Button>
            <Button loading={loading.get()} fullWidth onClick={onDelete} mt='md'>
              Delete
            </Button>
          </Group>
        </>
      ),
    })
  }

  return (
    <Button
      onClick={(event) => {
        event.stopPropagation()
        openConfirmModal()
      }}
      loading={loading.get()}
      variant='light'
      color='red'
      size='xs'
    >
      <IconTrash strokeWidth={1.5} />
    </Button>
  )
}
