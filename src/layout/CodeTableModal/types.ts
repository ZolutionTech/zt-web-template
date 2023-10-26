import { CodeItem } from '@/models'
import { State } from '@hookstate/core'

export type CodeTableModalProps = {
  modalState: State<{
    isOpen: boolean
    selectedCodeItem: CodeItem | null
    isEdit: boolean
    selectedTableCode: string | null
  }>
  onClose?: () => void
}
