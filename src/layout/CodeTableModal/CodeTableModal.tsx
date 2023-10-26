import React, { useEffect } from 'react'
import { Button, Card, Grid, Group, Modal, SimpleGrid, Stack, Title } from '@mantine/core'
import { useHookstate } from '@hookstate/core'

import { CodeTableService, LanguageService } from '@/services'
import { useCodeTable } from '@/state'
import { parseState, useForm } from '@/utils'
import { CodeTableModalProps } from './types'
import { FormField, FormFieldMetaType } from '@/components'
import { notifications } from '@mantine/notifications'

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
            <ManageTranslations />
          </Grid.Col>
        </Grid>
      </Modal>
    </>
  )
}

export default CodeTableModal

const ManageTranslations = () => {
  const codeTable = useCodeTable()

  const request2 = async () => {
    const { data, error } = await LanguageService.createItem({
      languageCode: 'DA',
      tableCode: 'LANG',
      itemCode: 'DA',
      text: 'Dansk',
    })
  }
  return (
    <Card withBorder>
      <Title order={3}>Translations</Title>
    </Card>
  )
}
