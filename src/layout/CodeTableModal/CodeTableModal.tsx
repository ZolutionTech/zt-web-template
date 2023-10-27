import React, { useEffect } from 'react'
import {
  ActionIcon,
  Button,
  Card,
  Grid,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { ImmutableObject, State, useHookstate } from '@hookstate/core'

import { CodeTableService, LanguageService, ParsedCodeItem } from '@/services'
import { useCodeTable } from '@/state'
import { parseState, useForm } from '@/utils'
import { CodeTableModalProps } from './types'
import { FormField, FormFieldMetaType } from '@/components'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconTrash, IconX } from '@tabler/icons-react'

const CodeTableModal = ({ modalState, onClose }: CodeTableModalProps) => {
  const { isOpen, selectedCodeItem, selectedTableCode, isEdit } = modalState
  const loading = useHookstate(false)

  const fields: FormFieldMetaType[] = [
    {
      key: 'tableCode',
      label: 'Table Code',
      props: { disabled: true },
    },
    {
      key: 'itemCode',
      label: 'Item Code',
      props: { disabled: isEdit.value ? true : false },
    },
    {
      key: 'internalName',
      label: 'Internal Name',
    },
  ]

  const { form, reinitializeForm } = useForm({
    fields,
    initialValues: isEdit.get()
      ? selectedCodeItem.value!
      : {
          tableCode: selectedTableCode.get(),
        },
  })

  useEffect(() => {
    initializeForm()
  }, [selectedTableCode.value, selectedCodeItem.value])

  const initializeForm = () => {
    if (isEdit.get()) {
      // initialize form with selectedCodeItem
      reinitializeForm(parseState(selectedCodeItem.get()))
    } else {
      // initialize form with empty values
      reinitializeForm(null, {
        tableCode: selectedTableCode.get(),
      })
    }
  }

  const createItem = async () => {
    if (form.validate().hasErrors) return

    const input = {
      tenantCode: '_',
      ...form.values,
    }

    loading.set(true)
    const { data, status, error } = await CodeTableService.createItem(input)
    loading.set(false)

    if (data && status === 200) {
      notifications.show({
        title: 'Success',
        message: `Code Item ${data.itemCode} created`,
        color: 'teal',
      })

      isEdit.set(true)
      reinitializeForm(data)
      //   handleClose()
    } else {
      notifications.show({
        title: 'Error',
        message: error ?? 'Something went wrong',
        color: 'red',
      })
    }
  }

  const updateItem = async () => {
    if (form.validate().hasErrors) return

    const input = {
      tenantCode: '_',
      ...form.values,
    }

    loading.set(true)
    const { data, status, error } = await CodeTableService.updateItem(input)
    loading.set(false)

    if (data && status === 200) {
      notifications.show({
        title: 'Success',
        message: `Code Item ${data.itemCode} updated`,
        color: 'teal',
      })
      selectedCodeItem.set(data)
    } else {
      notifications.show({
        title: 'Error',
        message: error ?? 'Something went wrong',
        color: 'red',
      })
    }
  }

  const handleClose = () => {
    onClose?.()
    form.reset()
    isOpen.set(false)
  }

  return (
    <>
      <Modal fullScreen opened={isOpen.get()} onClose={handleClose}>
        <Grid>
          <Grid.Col span={8}>
            <Card withBorder>
              <Stack>
                <Title order={1}>
                  {isEdit.get()
                    ? `Update Code Item`
                    : `Create Code Item for ${
                        CodeTableService.getItem('TACO', selectedTableCode.value!).internalName
                      }`}
                </Title>

                <SimpleGrid cols={2}>
                  {fields.map((field) => (
                    <FormField key={field.key} field={field} form={form} />
                  ))}
                </SimpleGrid>

                <Group justify='flex-end'>
                  <Button
                    variant='light'
                    onClick={() => {
                      handleClose()
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    loading={loading.get()}
                    onClick={() => {
                      isEdit.get() ? updateItem() : createItem()
                    }}
                  >
                    Save
                  </Button>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={4}>
            <ManageTranslations codeItem={selectedCodeItem} />
          </Grid.Col>
        </Grid>
      </Modal>
    </>
  )
}

export default CodeTableModal

const ManageTranslations = ({
  codeItem,
}: {
  codeItem: State<ParsedCodeItem | null, {}> | null
}) => {
  const codeTable = useCodeTable()

  return (
    <Card withBorder>
      <Title order={3}>Translations</Title>

      {codeItem && codeItem.value ? (
        <Stack>
          <TextInput
            label='English (default from Internal Name value)'
            readOnly
            value={codeItem.value.internalName}
          />

          {CodeTableService.getTable('LANG')
            .filter((item) => item.itemCode !== 'EN')
            .map((item) => (
              <TranslationInput
                key={item.itemCode}
                languageCode={item.itemCode}
                codeItem={codeItem}
              />
            ))}
        </Stack>
      ) : (
        <Text>Save the code item before making translations</Text>
      )}
    </Card>
  )
}

const TranslationInput = ({
  codeItem,
  languageCode,
}: {
  codeItem: State<ParsedCodeItem | null, {}>
  languageCode: string
}) => {
  const initialInput = useHookstate(codeItem.value?.label?.[languageCode] || '')
  const input = useHookstate(codeItem.value?.label?.[languageCode])
  const loading = useHookstate(false)

  const createItem = async () => {
    const params = {
      languageCode,
      tableCode: codeItem.value?.tableCode,
      itemCode: codeItem.value?.itemCode,
      text: input.get(),
    }

    loading.set(true)
    const { data, status, error } = await LanguageService.create(params)
    loading.set(false)

    if (data && status === 200) {
      notifications.show({
        title: 'Success',
        message: `Translation created`,
        color: 'teal',
      })
      initialInput.set(data.text)
    } else {
      notifications.show({
        title: 'Error',
        message: error ?? 'Something went wrong',
        color: 'red',
      })
    }
  }

  const updateItem = async () => {
    const params = {
      languageCode,
      tableCode: codeItem.value?.tableCode,
      itemCode: codeItem.value?.itemCode,
      text: input.get(),
    }

    loading.set(true)
    const { data, status, error } = await LanguageService.update(params)
    loading.set(false)

    if (data && status === 200) {
      notifications.show({
        title: 'Success',
        message: `Translation updated`,
        color: 'teal',
      })
      initialInput.set(data.text)
    } else {
      notifications.show({
        title: 'Error',
        message: error ?? 'Something went wrong',
        color: 'red',
      })
    }
  }

  const deleteItem = async () => {
    const params = {
      languageCode,
      tableCode: codeItem.value?.tableCode,
      itemCode: codeItem.value?.itemCode,
    }

    loading.set(true)
    const { data, status, error } = await LanguageService.delete(params)
    loading.set(false)

    if (data && status === 200) {
      notifications.show({
        title: 'Success',
        message: `Translation deleted`,
        color: 'teal',
      })
      input.set('')
      initialInput.set('')
    } else {
      notifications.show({
        title: 'Error',
        message: error ?? 'Something went wrong',
        color: 'red',
      })
    }
  }

  return (
    <Group wrap='nowrap' align='flex-end'>
      <TextInput
        value={input.get()}
        onChange={(event) => input.set(event.currentTarget.value)}
        label={CodeTableService.getItem('LANG', languageCode).internalName}
        w='100%'
      />

      {input.get() === initialInput.get() ? (
        <ActionIcon h={35} color='red' variant='light' loading={loading.get()} onClick={deleteItem}>
          <IconTrash strokeWidth={1.5} />
        </ActionIcon>
      ) : (
        <>
          <ActionIcon
            h={35}
            loading={loading.get()}
            onClick={() => {
              initialInput.get() ? updateItem() : createItem()
            }}
          >
            <IconCheck />
          </ActionIcon>

          <ActionIcon
            h={35}
            variant='light'
            color='red'
            onClick={() => {
              input.set(initialInput.get() || '')
            }}
          >
            <IconX />
          </ActionIcon>
        </>
      )}
    </Group>
  )
}
