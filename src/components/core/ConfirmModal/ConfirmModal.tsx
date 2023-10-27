import { useHookstate } from '@hookstate/core'
import { Button, Group, Modal, Stack, Text, TextInput, Title } from '@mantine/core'
import React from 'react'
import { ConfirmModalProps } from './types'

export const ConfirmModal = ({
  isOpen,
  title = 'Do you want to proceed?',
  text = 'This action is irreversible',
  onConfirm,
  withConfirmCode = false,
  confirmCode = 'confirm',
  cancelProps,
  confirmProps,
}: ConfirmModalProps) => {
  const confirmInput = useHookstate('')
  const loading = useHookstate(false)
  const error = useHookstate('')

  const handleConfirm = async () => {
    if (withConfirmCode && confirmInput.get() !== confirmCode) {
      error.set('The input is incorrect')
      return
    }

    loading.set(true)

    await onConfirm()
    loading.set(false)
    onClose()
  }

  const onClose = () => {
    confirmInput.set('')
    error.set('')
    isOpen.set(false)
  }

  return (
    <Modal
      centered
      title={
        <Title order={3} style={{ margin: 0 }}>
          {title}
        </Title>
      }
      opened={isOpen.get()}
      onClose={() => isOpen.set(false)}
    >
      <Stack>
        <Text>{text}</Text>

        {withConfirmCode && (
          <TextInput
            value={confirmInput.get()}
            onChange={(event) => {
              confirmInput.set(event.currentTarget.value)
              error.set('')
            }}
            error={error.get()}
            label={`Type "${confirmCode}" to proceed`}
            placeholder={`${confirmCode}`}
            data-autofocus
          />
        )}
        <Group wrap='nowrap' justify='flex-end'>
          <Button variant='light' onClick={onClose} {...cancelProps}>
            Cancel
          </Button>
          <Button
            loading={loading.get()}
            onClick={handleConfirm}
            disabled={withConfirmCode && confirmInput.get() !== confirmCode}
            {...confirmProps}
          >
            Confirm
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
