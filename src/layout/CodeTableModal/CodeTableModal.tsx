import React, { useEffect } from 'react'
import { Button, Card, Grid, Group, Modal, SimpleGrid, Stack, Title } from '@mantine/core'
import { useHookstate } from '@hookstate/core'

import { CodeTableService, LanguageService } from '@/services'
import { useCodeTable } from '@/state'
import { parseState, useForm } from '@/utils'
import { CodeTableModalProps } from './types'
import { FormField, FormFieldMetaType } from '@/components'

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
      props: { disabled: isEdit ? true : false },
    },
    {
      key: 'internalName',
      label: 'Internal Name',
    },
  ]

  const { form, reinitializeForm } = useForm({
    fields,
    initialValues: isEdit.get()
      ? selectedTableCode
      : {
          tableCode: selectedTableCode.get(),
        },
  })

  useEffect(() => {
    initializeForm()
  }, [selectedCodeItem.value])

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

    console.log(input)

    loading.set(true)
    const { data, status, error } = await CodeTableService.createItem(input)
    loading.set(false)

    if (status === 200) {
      console.log(data)
      //   handleClose()
    }
  }

  const updateItem = async () => {}

  const handleClose = () => {
    onClose?.()
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
                    Cancel
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
