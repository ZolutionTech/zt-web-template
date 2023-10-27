import { State } from '@hookstate/core'
import { ButtonProps } from '@mantine/core'

export type ConfirmModalProps = {
  isOpen: State<boolean, {}>
  onConfirm: () => Promise<void>
  title?: string
  text?: string
  withConfirmCode?: boolean
  confirmCode?: string
  confirmProps?: ButtonProps
  cancelProps?: ButtonProps
}
