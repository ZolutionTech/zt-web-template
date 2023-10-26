import { UseFormReturnType } from '@mantine/form'

export type InputType =
  | 'text'
  | 'number'
  | 'list'
  | 'code-item-select'
  | 'slug'
  | 'code-input'
  | 'email'
  | 'password'
  | 'file-input'
  | 'color-input'
  | 'custom'
  | 'multi-select'
  | 'textarea'
  | 'switch'
  | 'file-input-thumbnail'
  | 'select'
  | 'rich-text'
  | 'dropzone'
  | 'date'
  | 'badge-list'
  | 'radio-buttons'

export type FormFieldProps = {
  form: UseFormReturnType<any, (values: any) => any>
  field: FormFieldMetaType
}

export type FormFieldMetaType = {
  key: string
  label?: string
  type?: InputType
  data?: { label: string; value: string }[]
  defaultValue?: any
  dependencies?: any[]
  validation?: (value: any, values: { [key: string]: any }) => string | null
  optional?: boolean
  component?: React.FC<any>
  props?: any
  other?: any
}
